import React, { useState, useEffect } from 'react';
import { Flex, Button, Layout, Menu } from 'antd';
import {  FaLeaf, FaSearch, FaHome, FaMoneyBillWave, FaUserAlt  } from "react-icons/fa";
import {
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  FormOutlined,
  NotificationOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
// import './FeePage.css';
import AnimatedFrame from '../../../../utils/animation_page';
import { Link } from 'react-router-dom';
import { Fee } from '../../../interface/interface.js';
import SideBar from '../SideBar/SideBar';

const { Header, Sider, Content } = Layout;
const rowsPerPage = 5;
const requiredMoney = 50;

type RoomFeeMap = {
  [key: string]: Fee;
};

function FeePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [requiredFee, setRequiredFee] = useState<Fee[]>([]);
  const [searchRoom, setSearchRoom] = useState("");
  const [roomFeeMap, setRoomFeeMap] = useState<RoomFeeMap>({});


  // search room number that need to be edited
  const [searchEditedRoom, setSearchEditedRoom] = useState("");
  const [editedMoney, setEditedMoney] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedTransferrer, setEditedTransferrer] = useState("");

  // search room number that need to be deleted
  const [searchDeletedRoom, setSearchDeletedRoom] = useState("");
  const [searchDeletedResult, setSearchDeletedResult] = useState(""); 
  const [error, setError] = useState("");

  // search the fee that filter by room number
  const [searchValues, setSearchValues] = useState({
    searchRoomFee: "",
    result: "",
  });

  // fetch data from database
  const fetchRequiredFee = async () => {
    try {
      const requiredFee: Fee[] = await window.electronAPI.fetchRequiredFee();
      const map: RoomFeeMap = {};

      for (var i = 0; i < requiredFee.length; i++) {
        map[requiredFee[i]["room_number"].toString()] = requiredFee[i];
      }

      setRequiredFee(requiredFee);
      setRoomFeeMap(map);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {fetchRequiredFee();}, []);

  // for searching
  const handleSearching = (e: any) => {
    const { name, value } = e.target;

    setSearchValues({
      searchRoomFee: value,
      result: "",
    });

  };
  
  useEffect(() => {
    if (searchValues.searchRoomFee) {
      var result = "";

      for (var i = 0; i < requiredFee.length; i++) {
        if (searchValues.searchRoomFee == requiredFee[i]["room_number"].toString()) {
          result = requiredFee[i]["amount_money"].toString();
          break;
        }
      }

      setSearchValues({
        searchRoomFee: searchValues.searchRoomFee,
        result: result
      });
    } else {

      setSearchValues({
        searchRoomFee: "",
        result: ""
      });

    }
  }, [searchValues.searchRoomFee]);

  // for deleting
  const handleDeleting = async (e: any) => {
    e.preventDefault();

    if (!searchDeletedRoom) {
      alert("Vui lòng nhập số phòng");

    } else {
      
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xoá dữ liệu cho phòng ${searchDeletedRoom}?`)
      if (confirmed) {
        try {
          const success = await window.electronAPI.deleteCompulsoryFee(Number(searchDeletedRoom));
    
          if (success) {
            alert("Đã xoá thành công.");
          } else {
            alert("Xoá không thành công.");
          }
        } catch(error) {
          console.log(error);
        }
      } else {
        alert("Đã huỷ thao tác xoá.");
      }

      fetchRequiredFee();
    }
  }
  
  const handleSubmit = (e: any) => {e.preventDefault();};

  return (
    <AnimatedFrame>
      <Layout>
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout className="site-layout">
          <Header className="header"> </Header>
          <Content style={{ margin: '14px', background: '#fff' }}>
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="container mx-auto grid grid-cols-2 md:grid-cols-2 gap-6 mb-6">
                {/* Transfer Money Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">
                    Thêm khoản thu
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="roomNumber"
                      >
                        Số phòng
                      </label>
                      <input
                        type="number"
                        id="roomNumber"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số phòng"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="transferAmount"
                      >
                        Số tiền nộp
                      </label>
                      <input
                        type="number"
                        id="transferAmount"
                        // value={transferAmount}
                        // onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số tiền"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="transferrer"
                      >
                        Người nộp tiền
                      </label>
                      <input
                        type="number"
                        id="transferAmount"
                        // value={transferAmount}
                        // onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập tên người nộp tiền"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="transferAmount"
                      >
                        Email
                      </label>
                      <input
                        type="number"
                        id="transferAmount"
                        // value={transferAmount}
                        // onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập email người nộp"
                        required
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Thêm khoản thu
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa khoản thu</h2>
                  <form onSubmit={handleSubmit}>
                    <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="roomNumber"
                        >
                          Số phòng
                    </label>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={searchDeletedRoom}
                        onChange={(e) => setSearchDeletedRoom(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số phòng"
                      />
                    </div>
                    {/* {searchRoom && (
                      <>
                        <p className="mt-2 text-lg text-red-500">
                          Số tiền phòng {searchRoom} CÒN THIẾU: 
                          {searchResult !== "" ? " " + (requiredMoney - parseFloat(searchResult)) + ".000 VND": ' 0 VND'}
                        </p>
                      </>
                    )} */}

                    <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="roomNumber"
                        >
                          Số tiền nộp
                    </label>

                    <div className="mb-4">
                      <input
                        type="text"
                        value={searchRoom}
                        onChange={(e) => setSearchRoom(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số tiền mới"
                      />
                    </div>

                    <div className="mb-4">
                        <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="transferrer"
                        >
                          Người nộp tiền
                        </label>
                        <input
                          type="number"
                          id="transferAmount"
                          // value={transferAmount}
                          // onChange={(e) => setTransferAmount(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="Nhập tên người nộp tiền mới"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="transferAmount"
                        >
                          Email
                        </label>
                        <input
                          type="number"
                          id="transferAmount"
                          // value={transferAmount}
                          // onChange={(e) => setTransferAmount(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="Nhập email người nộp mới"
                          required
                        />
                      </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                      >
                        Chỉnh sửa khoản thu
                    </button>   
                  </form>              
                </div>

                {/* Room Payments Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Xoá khoản thu</h2>
                  <form onSubmit={handleDeleting}>
                    <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="roomNumber"
                        >
                          Số phòng
                    </label>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={searchDeletedRoom}
                        onChange={(e) => setSearchDeletedRoom(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nhập số phòng"
                      />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                      >
                        Xoá khoản thu
                    </button>     
                  </form>            
                </div>
              {/* </div> */}

              {/* <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-4"> */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Xem khoản thu</h2>
                  <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="roomNumber"
                      >
                        Số phòng
                  </label>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={searchValues.searchRoomFee}
                      onChange={handleSearching}
                      className="w-full p-2 border rounded-md"
                      placeholder="Nhập số phòng"
                    />
                  </div>
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th>Số phòng</th>
                        <th>Người nộp</th>
                        <th>Đã nộp (000 VND)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        searchValues.searchRoomFee !== "" && searchValues.result !== ""? (
                          <tr>
                            <td>{roomFeeMap[searchValues.searchRoomFee].room_number}</td>
                            <td>{roomFeeMap[searchValues.searchRoomFee].representator}</td>
                            <td>{roomFeeMap[searchValues.searchRoomFee].amount_money}</td>
                          </tr>
                          ) : (<tr></tr>)
                      }
                    </tbody>
                  </table>
                </div>
                {/* </div> */}

              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </AnimatedFrame>
  );
}

export default FeePage;
