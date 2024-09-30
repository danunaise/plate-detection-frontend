"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

interface Plate {
  id: number;
  f_image: string;
  p_image: string;
  p_text: string;
  province: string;
  date: string;
}

// Establish a connection with Socket.IO
const socket = io("http://127.0.0.1:5000");

const Table: React.FC = () => {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const totalItems = plates.length;

  // Sort plates by date (newest first)
  const sortPlatesByDate = (plates: Plate[]) => {
    return plates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Fetch all plates initially
  const fetchPlates = () => {
    fetch("http://127.0.0.1:5000/api/plates")
      .then((response) => response.json())
      .then((data: Plate[]) => setPlates(sortPlatesByDate(data)))
      .catch((error) => console.error("Error fetching plates:", error));
  };

  // Search plates based on query
  const searchPlates = (query: string) => {
    fetch(`http://127.0.0.1:5000/api/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data: Plate[]) => setPlates(sortPlatesByDate(data)))
      .catch((error) => console.error("Error fetching search results:", error));
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchPlates(); // Load all plates when search is empty
    } else {
      searchPlates(value); // Search plates when search term exists
    }
  };

  // Fetch plates on initial render and listen for socket events
  useEffect(() => {
    fetchPlates();

    socket.on("sent_emit", () => {
      fetchPlates(); // Refresh plates when a new one is added
    });

    return () => {
      socket.off("sent_emit");
    };
  }, []);

  // Calculate paginated plates
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlates = plates.slice(indexOfFirstItem, indexOfLastItem);

  // Change current page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Change number of items per page
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  // Open modal with the selected image
  const openImagePopup = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Close modal
  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  // Format date to Thai locale
  const formatDateThai = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Intl.DateTimeFormat("th-TH", options).format(date);
  };

  return (
    <div>
      {/* Header with search bar */}
      <div className="flex justify-between items-center bg-blue-400 p-4 xl:px-52 w-full text-white">
        <h1 className="text-xl font-bold">Plate Detection</h1>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="ค้นหาด้วยทะเบียนหรือจังหวัด"
            className="bg-white text-black rounded-md p-2 w-52"
          />
          <div className="bg-white">
            <svg
              className="absolute -left-8 top-0 w-9 h-10 p-2 text-gray-500 bg-white rounded-l-md"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.42-1.42l5.386 5.385-1.416 1.415-5.39-5.38zM8 14A6 6 0 108 2a6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between my-3 items-center mx-2 xl:mx-52">
        <div className="text-sm">
          <span>Total: <strong>{totalItems}</strong></span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Lines per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="p-2 border rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table for plates */}
      <div className="overflow-x-auto mx-1 xl:mx-52">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-white text-left">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">รูปภาพ</th>
              <th className="p-4">รูปป้ายทะเบียน</th>
              <th className="p-4">ทะเบียน</th>
              <th className="p-4">จังหวัด</th>
              <th className="p-4">วันเวลาที่ตรวจพบ</th>
            </tr>
          </thead>
          <tbody>
            {currentPlates.map((plate) => (
              <tr key={plate.id} className="border-t border-gray-200">
                <td className="p-4">{plate.id}</td>
                <td className="p-4">
                  <img
                    src={`http://127.0.0.1:5000/${plate.f_image}`}
                    alt="Motorbike"
                    className="w-24 h-auto cursor-pointer"
                    onClick={() => openImagePopup(`http://127.0.0.1:5000/${plate.f_image}`)}
                  />
                </td>
                <td className="p-4">
                  <img
                    src={`http://127.0.0.1:5000/${plate.p_image}`}
                    alt="Plate"
                    className="w-24 h-auto cursor-pointer"
                    onClick={() => openImagePopup(`http://127.0.0.1:5000/${plate.p_image}`)}
                  />
                </td>
                <td className="p-4">{plate.p_text}</td>
                <td className="p-4">{plate.province}</td>
                <td className="p-4">{formatDateThai(plate.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="my-4 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 border rounded-md"
          >
            {"<"}
          </button>
          {Array.from(Array(Math.ceil(plates.length / itemsPerPage)).keys()).map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`mx-1 px-3 py-1 border rounded-md ${
                currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(plates.length / itemsPerPage)}
            className="mx-1 px-3 py-1 border rounded-md"
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Model Popup for Image */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-auto h-auto max-w-screen-lg max-h-screen"
            />
            <button
              className="absolute -top-5 -right-5 bg-red-500 text-white px-3 py-1 rounded-full"
              onClick={closeImagePopup}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
