import React, { useState, useEffect } from 'react';
import { Resident } from '../../../interface/interface.js';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const rowsPerPage = 10;

function ResidentTable() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchRoom, setSearchRoom] = useState('');

  const fetchResidents = async () => {
    try {
      const residents = await window.electronAPI.fetchResidentsList();
      setResidents(residents);
      setTotalPages(Math.ceil(residents.length / rowsPerPage));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredResidents = residents.filter((resident) =>
    resident.room_number.toLowerCase().includes(searchRoom.toLowerCase())
  );

  const currentResidents = filteredResidents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredResidents.length / rowsPerPage));
    setCurrentPage(1);
  }, [searchRoom, filteredResidents]);

  const handleExport = () => {
    // Định nghĩa dữ liệu với các cột và tiêu đề khớp với giao diện
    const formattedData = currentResidents.map((resident) => ({
      'ID': resident.id,
      'Số phòng': resident.room_number,
      'Họ và tên': resident.full_name,
      'Năm sinh': resident.birth_year,
      'Nghề nghiệp': resident.occupation,
      'Số điện thoại': resident.phone_number,
      'Email': resident.email,
    }));

    // Sử dụng papaparse để chuyển đổi thành CSV
    const csvData = Papa.unparse(formattedData);

    // Thêm BOM để hỗ trợ UTF-8 (tránh lỗi phông chữ tiếng Việt)
    const utf8Bom = '\uFEFF';
    const blob = new Blob([utf8Bom + csvData], { type: 'text/csv;charset=utf-8;' });

    // Lưu file với tên "filtered_residents.csv"
    saveAs(blob, 'filtered_residents.csv');
  };



  return (
    <div className="resident-table-container">
      {/* Thanh tìm kiếm */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm theo số phòng"
          value={searchRoom}
          onChange={(e) => setSearchRoom(e.target.value)}
          className="form-control"
        />
      </div>

      {/* Bảng dữ liệu */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Số phòng</th>
            <th>Họ và tên</th>
            <th>Năm sinh</th>
            <th>Nghề nghiệp</th>
            <th>Số điện thoại</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentResidents.length > 0 ? (
            currentResidents.map((resident) => (
              <tr key={resident.id}>
                <td>{resident.id}</td>
                <td>{resident.room_number}</td>
                <td>{resident.full_name}</td>
                <td>{resident.birth_year}</td>
                <td>{resident.occupation}</td>
                <td>{resident.phone_number}</td>
                <td>{resident.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>Không tìm thấy cư dân</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Điều hướng trang */}
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Tiếp theo
        </button>
      </div>

      {/* Nút xuất file */}
      <div className="export-button-container">
        <button onClick={handleExport} className="btn btn-success">
          Xuất file CSV
        </button>
      </div>
    </div>
  );
}

export default ResidentTable;
