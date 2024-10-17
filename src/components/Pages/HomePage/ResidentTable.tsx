import React, {useState, useEffect} from 'react';
import { Resident } from '../../../interface/interface.js';

const rowsPerPage = 10;

function ResidentTable() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [residents, setResidents] = useState<Resident[]>([]);

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

  const currentResidents = residents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="resident-table-container">
      <h1 className = "text-2xl font-semibold mb-4">Danh sách cư dân</h1>
      {/* <button className="btn btn-primary">Add Student</button> */}
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
                <td colSpan={7}>No residents found</td>
              </tr>
            )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default ResidentTable;