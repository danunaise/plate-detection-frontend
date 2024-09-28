import Image from "next/image";
import SearchBar from "./components/SearchBar";
import Table from "./components/Table";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100">
        {/* Search Bar */}

        {/* Table */}
        <div className="container mx-auto">
          <Table />
        </div>
        <footer>
          <div className="container mx-auto text-center py-4 text-gray-500">
            <p>© 2021 Plate detection Make with Danunai and Pichit</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
