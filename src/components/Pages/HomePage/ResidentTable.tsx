import React, { useState, useEffect } from 'react';
import { Resident } from '../../../interface/interface.js';

const rowsPerPage = 10;

function ResidentTable() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [editingResidentId, setEditingResidentId] = useState(null);
  const [editedResident, setEditedResident] = useState({
    room_number: '',
    full_name: '',
    birth_year: '',
    occupation: '',
    phone_number: '',
    email: ''
  });
  const [isAdding, setIsAdding] = useState(false); // Trạng thái thêm cư dân mới
  const [newResident, setNewResident] = useState({
    room_number: '',
    full_name: '',
    birth_year: '',
    occupation: '',
    phone_number: '',
    email: ''
  });

  // Lấy dữ liệu từ localStorage khi trang load
  useEffect(() => {
    const storedResidents = localStorage.getItem('residents');
    if (storedResidents) {
      setResidents(JSON.parse(storedResidents));
      setTotalPages(Math.ceil(JSON.parse(storedResidents).length / rowsPerPage));
    }
  }, []);

  const saveResidentsToLocalStorage = (updatedResidents) => {
    localStorage.setItem('residents', JSON.stringify(updatedResidents));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentResidents = residents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Xử lý thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewResident({ ...newResident, [name]: value });
    } else {
      setEditedResident({ ...editedResident, [name]: value });
    }
  };

  // Bắt đầu chỉnh sửa cư dân
  const handleEdit = (resident) => {
    setEditingResidentId(resident.id);
    setEditedResident(resident); // Điền thông tin cư dân hiện tại vào form
  };

  // Lưu lại thông tin cư dân sau khi chỉnh sửa
  const handleSave = () => {
    const updatedResidents = residents.map((resident) =>
      resident.id === editingResidentId ? editedResident : resident
    );
    setResidents(updatedResidents);
    setEditingResidentId(null); // Đặt lại trạng thái không chỉnh sửa
    saveResidentsToLocalStorage(updatedResidents); // Lưu vào localStorage
  };

  // Hủy bỏ việc chỉnh sửa
  const handleCancel = () => {
    setEditingResidentId(null); // Đặt lại trạng thái không chỉnh sửa
  };

  // Bắt đầu thêm cư dân mới
  const handleAddResident = () => {
    const updatedResidents = [...residents, { ...newResident, id: Date.now() }]; // thêm id tạm thời bằng Date.now()
    setResidents(updatedResidents);
    setTotalPages(Math.ceil(updatedResidents.length / rowsPerPage));

    // Reset lại form
    setNewResident({
      room_number: '',
      full_name: '',
      birth_year: '',
      occupation: '',
      phone_number: '',
      email: ''
    });
  };

  const handleAddNew = () => {
    setIsAdding(true); // Chuyển sang chế độ thêm
    setNewResident({
      room_number: '',
      full_name: '',
      birth_year: '',
      occupation: '',
      phone_number: '',
      email: ''
    });
  };

  // Lưu cư dân mới vào danh sách
  const handleSaveNew = () => {
    if (
      !newResident.room_number ||
      !newResident.full_name ||
      !newResident.birth_year ||
      !newResident.occupation ||
      !newResident.phone_number ||
      !newResident.email
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const newResidentWithId = { ...newResident, id: Date.now() }; // Tạo ID mới cho cư dân
    const updatedResidents = [...residents, newResidentWithId];
    setResidents(updatedResidents);
    setIsAdding(false); // Tắt form thêm mới sau khi lưu
    saveResidentsToLocalStorage(updatedResidents); // Lưu vào localStorage
  };

  // Hủy bỏ thêm cư dân mới
  const handleCancelNew = () => {
    setIsAdding(false); // Tắt form thêm mới
  };

  return (
    <div className="resident-table-container">
      <div className="res">
        <h2>Danh sách cư dân</h2>
        <button onClick={handleAddNew}>Thêm cư dân</button>
      </div>

      {isAdding && (
        <div className="add-resident-form">
          <h3>Thêm cư dân mới</h3>
          <input
            type="text"
            name="room_number"
            placeholder="Số phòng"
            value={newResident.room_number}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="full_name"
            placeholder="Họ và tên"
            value={newResident.full_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="birth_year"
            placeholder="Năm sinh"
            value={newResident.birth_year}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="occupation"
            placeholder="Nghề nghiệp"
            value={newResident.occupation}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Số điện thoại"
            value={newResident.phone_number}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newResident.email}
            onChange={handleInputChange}
          />
          <button onClick={handleSaveNew}>Lưu</button>
          <button onClick={handleCancelNew}>Hủy</button>
        </div>
      )}

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
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentResidents.length > 0 ? (
            currentResidents.map((resident) => (
              <tr key={resident.id}>
                {editingResidentId === resident.id ? (
                  <>
                    <td>{resident.id}</td>
                    <td>
                      <input
                        type="text"
                        name="room_number"
                        value={editedResident.room_number}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="full_name"
                        value={editedResident.full_name}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="birth_year"
                        value={editedResident.birth_year}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="occupation"
                        value={editedResident.occupation}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="phone_number"
                        value={editedResident.phone_number}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={editedResident.email}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleSave}>Lưu</button>
                      <button onClick={handleCancel}>Hủy</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{resident.id}</td>
                    <td>{resident.room_number}</td>
                    <td>{resident.full_name}</td>
                    <td>{resident.birth_year}</td>
                    <td>{resident.occupation}</td>
                    <td>{resident.phone_number}</td>
                    <td>{resident.email}</td>
                    <td>
                      <button onClick={() => handleEdit(resident)}>Chỉnh sửa</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No residents found</td>
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
          Trang trước
        </button>
        <span>Trang {currentPage}</span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ResidentTable;


