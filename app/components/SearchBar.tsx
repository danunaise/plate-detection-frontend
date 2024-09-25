import React from "react";

const SearchBar = () => {
  return (
    <div className="flex justify-between items-center bg-blue-400 p-4 text-white">
      <h1 className="text-xl font-bold">Plate detection</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 pl-8 rounded-md text-black"
        />
        <svg
          className="absolute left-2 top-2 w-4 h-4 text-gray-500"
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
  );
};

export default SearchBar;
