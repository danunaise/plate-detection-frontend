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

// สร้างการเชื่อมต่อ Socket.IO
const socket = io("http://127.0.0.1:5000");

const Table: React.FC = () => {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ฟังก์ชันเรียงลำดับข้อมูลแผ่นป้ายตามวันที่ (ล่าสุดก่อน)
  const sortPlatesByDate = (plates: Plate[]) => {
    return plates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // ดึงข้อมูลแผ่นป้ายทั้งหมดเมื่อ component ถูกสร้าง
  const fetchPlates = () => {
    fetch("http://127.0.0.1:5000/api/plates")
      .then((response) => response.json())
      .then((data: Plate[]) => setPlates(sortPlatesByDate(data))) // เรียงตามวันที่ก่อนใส่ลง state
      .catch((error) => console.error("Error fetching plates:", error));
  };

  // ฟังก์ชันดึงข้อมูลที่ค้นหา
  const searchPlates = (query: string) => {
    fetch(`http://127.0.0.1:5000/api/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data: Plate[]) => setPlates(sortPlatesByDate(data))) // เรียงตามวันที่ก่อนใส่ลง state
      .catch((error) => console.error("Error fetching search results:", error));
  };

  // Handle the search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchPlates(); // ถ้าไม่มีคำค้นหา ให้โหลดข้อมูลทั้งหมด
    } else {
      searchPlates(value); // ถ้ามีคำค้นหา ให้ค้นหาข้อมูล
    }
  };

  useEffect(() => {
    fetchPlates(); // โหลดข้อมูลแผ่นป้ายครั้งแรกเมื่อ component ถูกสร้าง

    // ฟังอีเวนต์ 'sent_emit' ที่ถูกส่งจาก backend
    socket.on("sent_emit", (message) => {
      console.log("Event from backend:", message);
      fetchPlates(); // รีเฟรชข้อมูลโดยดึงข้อมูลทั้งหมดใหม่
    });

    // ทำความสะอาดเมื่อ component ถูกยกเลิก
    return () => {
      socket.off("sent_emit");
    };
  }, []);

  return (
    <div className="overflow-x-auto mt-4">

    <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="ค้นหาด้วยทะเบียนหรือจังหวัด"
          className="p-2 border rounded-lg w-full"
        />
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">รูปภาพ</th>
            <th className="p-4">รูปป้ายทะเบียน</th>
            <th className="p-4">ทะเบียน</th>
            <th className="p-4">จังหวัด</th>
            <th className="p-4">วันที่ตรวจพบ</th>
          </tr>
        </thead>
        <tbody>
          {plates.map((plate) => (
            <tr key={plate.id} className="border-t border-gray-200">
              <td className="p-4">{plate.id}</td>
              <td className="p-4">
                <img
                  src={`http://127.0.0.1:5000/${plate.f_image}`}
                  alt="Motorbike"
                  className="w-24 h-auto"
                />
              </td>
              <td className="p-4">
                <img
                  src={`http://127.0.0.1:5000/${plate.p_image}`}
                  alt="Plate"
                  className="w-24 h-auto"
                />
              </td>
              <td className="p-4">{plate.p_text}</td>
              <td className="p-4">{plate.province}</td>
              <td className="p-4">{plate.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
