import React from "react";

const Table = () => {
  return (
    <div className="overflow-x-auto mt-4">
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
          <tr className="border-t border-gray-200">
            <td className="p-4">1</td>
            <td className="p-4">
              <img
                src="/path-to-motorbike-image.jpg"
                alt="Motorbike"
                className="w-24 h-auto"
              />
            </td>
            <td className="p-4">
              <img
                src="/path-to-plate-image.jpg"
                alt="Plate"
                className="w-24 h-auto"
              />
            </td>
            <td className="p-4">XXXXXXX</td>
            <td className="p-4">กรุงเทพมหานคร</td>
            <td className="p-4">99/99/9999 99:99</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
