import Image from "next/image";
import SearchBar from "./components/SearchBar";
import Table from "./components/Table";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100">
        {/* Search Bar */}
        <SearchBar />

        {/* Table */}
        <div className="container mx-auto p-4">
          <Table />
        </div>
      </div>
    </div>
  );
}
