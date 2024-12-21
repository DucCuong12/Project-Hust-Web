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
  const [editingResidentId, setEditingResidentId] = useState<number | null>(null);
  const [editedResident, setEditedResident] = useState<Resident | null>(null);
  // const [saveSuccess, setSaveSuccess] = useState<boolean>(false); // Trạng thái lưu thành công


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

  // Mới thêm
  const [isAdding, setIsAdding] = useState(false); // Trạng thái thêm cư dân mới
  const [newResident, setNewResident] = useState({
    room_number: '',
    full_name: '',
    birth_year: '',
    occupation: '',
    phone_number: '',
    email: '',
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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewResident({ ...newResident, [name]: value });
    } else if (editedResident) {
      setEditedResident({ ...editedResident, [name]: value });
    }
  };
  const handleSave = () => {
    const updatedResidents = residents.map((resident) =>
     resident.id === editingResidentId ? editedResident : resident
    );
    setResidents(updatedResidents);
    setEditingResidentId(null);
    setEditedResident(null);
    saveResidentsToLocalStorage(updatedResidents); // Lưu vào localStorage
      // setSaveSuccess(true); // Hiển thị thông báo lưu thành công
      // setTimeout(() => setSaveSuccess(false), 3000); // Ẩn thông báo sau 3 giây

  };

  const handleCancel = () => {
    setEditingResidentId(null);
    setEditedResident(null);
  };

  // Neww2
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
      email: '',
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
      email: '',
    });
  };

  function isValidPhoneNumber(phoneNumber) {
    // Kiểm tra nếu chuỗi chỉ chứa các chữ số và độ dài từ 9 đến 12
    const regex = /^[0-9]{9,12}$/;
    return regex.test(phoneNumber);
}

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
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if(!isValidPhoneNumber(newResident.phone_number)) {
      alert('SDT phải gồm 9-12 chữ số');
      return;
    }

    const newResidentWithId = { ...newResident, id: Date.now() }; // Tạo ID mới cho cư dân
    const updatedResidents = [...residents, newResidentWithId];
    setResidents(updatedResidents);
    setIsAdding(false); // Tắt form thêm mới sau khi lưu
    saveResidentsToLocalStorage(updatedResidents); // Lưu vào localStorage
    alert('Thêm cư dân thành công');
  };

  // Hủy bỏ thêm cư dân mới
  const handleCancelNew = () => {
    setIsAdding(false); // Tắt form thêm mới
  };
  const filteredResidents = residents.filter((resident) =>
    resident.room_number.toLowerCase().includes(searchRoom.toLowerCase())
  );

  const currentResidents = filteredResidents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredResidents.length / rowsPerPage));
    setCurrentPage(1);
  }, [searchRoom]);

  const handleExport = () => {
    const formattedData = currentResidents.map((resident) => ({
      ID: resident.id,
      'Số phòng': resident.room_number,
      'Họ và tên': resident.full_name,
      'Năm sinh': resident.birth_year,
      'Nghề nghiệp': resident.occupation,
      'Số điện thoại': resident.phone_number,
      Email: resident.email,
    }));

    const csvData = Papa.unparse(formattedData);
    const utf8Bom = '\uFEFF';
    const blob = new Blob([utf8Bom + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, 'filtered_residents.csv');
  };

  return (
    <div className="resident-table-container">
      <div className="res">
        <h2>Danh sách cư dân</h2>
        <button className="btn-primary p-2 bg-blue-400 font-medium" onClick={handleAddNew}>
          Thêm cư dân
        </button>
      </div>

      {isAdding && (
        <div className="add-resident-form">
          <h3>Thêm cư dân mới</h3>
          <input
            className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
            type="number"
            name="room_number"
            placeholder="Số phòng"
            value={newResident.room_number}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="text"
            name="full_name"
            placeholder="Họ và tên"
            value={newResident.full_name}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="number"
            name="birth_year"
            placeholder="Năm sinh"
            value={newResident.birth_year}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="text"
            name="occupation"
            placeholder="Nghề nghiệp"
            value={newResident.occupation}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="text"
            name="phone_number"
            placeholder="Số điện thoại"
            value={newResident.phone_number}
            onChange={handleInputChange}
          />
          <input
            className='custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500'
            type="email"
            name="email"
            placeholder="Email"
            value={newResident.email}
            onChange={handleInputChange}
          />
            <button className='btn-submit rounded-sm p-2  font-semibold text-white bg-green-400' onClick={handleSaveNew}>Lưu</button>
            <button className='btn-delete rounded-sm p-2 font-semibold text-white bg-red-400' onClick={handleCancelNew}>Hủy</button>
        </div>
      )}

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
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="number"
                          name="room_number"
                          value={editedResident.room_number}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="text"
                          name="full_name"
                          value={editedResident.full_name}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="number"
                          name="birth_year"
                          value={editedResident.birth_year}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="text"
                          name="occupation"
                          value={editedResident.occupation}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="text"
                          name="phone_number"
                          value={editedResident.phone_number}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-input placeholder-slate-400 border-b-1 border-gray-300 text-violet-500"
                          type="email"
                          name="email"
                          value={editedResident.email}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td className="min-w-[200px]">
                        <button
                          className="btn-submit p-1 font-medium text-white bg-green-400"
                          onClick={handleSave}
                        >
                          Lưu
                        </button>
                        <button
                          className="btn-delete p-1 font-medium text-white bg-red-400"
                          onClick={handleCancel}
                        >
                          Hủy
                        </button>
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
                        <button
                          className="btn-primary p-1 px-2 font-medium bg-slate-400 text-gray-600"
                          onClick={() => handleEdit(resident)}
                        >
                          Chỉnh sửa
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>Không tìm thấy cư dân</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Điều hướng trang */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            className="pagination-controls"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
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
          <div
            className="export-button-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button onClick={handleExport} className="btn btn-success">
              Xuất file CSV
            </button>
          </div>
        </div>
      </div>
    </div>
);
}
export default ResidentTable;
