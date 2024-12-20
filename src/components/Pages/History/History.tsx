import React, { useState, useEffect } from 'react';
import { Flex, Button, Layout, Menu } from 'antd';
import {  FaLeaf, FaSearch, FaHome, FaMoneyBillWave, FaUserAlt  } from "react-icons/fa";
import { Form } from 'react-bootstrap';
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
import { BaseFee, TransferFee } from '../../../interface/interface.js';
import SideBar from '../SideBar/SideBar';
import ConfirmModal from '../../ConfirmModal/ConfirmModel';

const { Header, Sider, Content } = Layout;
// const FeeMap: Record<"Tiền điện" | "Tiền nước" | "Tiền ủng hộ bão" | "Tiền ủng hộ lũ" | "Tiền wifi", string> = {
//     "Tiền điện": "Bắt buộc",
//     "Tiền wifi": "Bắt buộc",
//     "Tiền nước": "Bắt buộc",
//     "Tiền ủng hộ bão": "Tự nguyện",
//     "Tiền ủng hộ lũ": "Tự nguyện",
//   };
  

type RoomFeeMap = {
  [key: string]: TransferFee[];
};

function HistoryPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [requiredFee, setRequiredFee] = useState<TransferFee[]>([]);
  const [searchRoom, setSearchRoom] = useState("");
  const [roomFeeMap, setRoomFeeMap] = useState<RoomFeeMap>({});
  const [allRows, setAllRows] = useState<BaseFee[]>([]);
  const [FeeMap, setFeeMap] = useState<string[]>([]);

  // search the fee that filter by room number
  const [searchValues, setSearchValues] = useState({
    searchRoomFee: "",
    result: "",
  });

  const fetchFee = async () => {
    const requiredFee: BaseFee[] = await window.electronAPI.fetchMyFee();

    setAllRows(requiredFee);
  };

  fetchFee();

  // fetch data from database
  const fetchRequiredFee = async () => {
      const requiredFee: TransferFee[] = await window.electronAPI.fetchTransferFee();
      const mapFee: RoomFeeMap = {};

      for (const fee of requiredFee) {
        const roomNumber = fee["room_number"].toString();

        if (!mapFee[roomNumber]) {
            mapFee[roomNumber] = [];
          }
        
          mapFee[roomNumber].push(fee);
      }

      setRequiredFee(requiredFee);
      setRoomFeeMap(mapFee);

  };

  useEffect(() => {
  // Simulate fetching data
  const fetchFees = async () => {
    const requiredFeeData = await window.electronAPI.fetchContributeFee();
    const fees = requiredFeeData.map((row: any) => String(row.fee_name)); // Ensure strings
    console.log(fees);
    setFeeMap(fees); // Set the list of fees
  };

  fetchFees();
}, []);
  useEffect(() => {fetchRequiredFee();}, []);

  // for searching
  const handleSearching = (e: any) => {
    const { name, value } = e.target;

    setSearchValues({
      searchRoomFee: value,
      result: "",
    });

    fetchRequiredFee();

  };
  
//   useEffect(() => {
//     if (searchValues.searchRoomFee) {
//       var result = "";

//       for (const fee of requiredFee) {
//         if (searchValues.searchRoomFee == fee["room_number"].toString()) {
//           result = fee["money"].toString();
//           break;
//         }
//       }

//       setSearchValues({
//         searchRoomFee: searchValues.searchRoomFee,
//         result: result
//       });
//     } else {

//       setSearchValues({
//         searchRoomFee: "",
//         result: ""
//       });

//     }
//   }, [searchValues.searchRoomFee]);

  // for deleting
  const [searchDeletedRoom, setSearchDeletedRoom] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isErrorDeleteModalOpen, setErrorDeleteModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [isSuccessDeleteModalOpen, setSuccessDeleteModalOpen] = useState(false);
  const [errorDeleteMessage, setErrorDeleteMessage] = useState('');
  const [confirmationDeleteMessage, setConfirmationDeleteMessage] = useState('');

  const handleCloseDelete = () => setDeleteModalOpen(false);

  const handleSubmitDeleting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    var check = 0;

    for (var i = 0; i < requiredFee.length; i++) {
      if (searchDeletedRoom == requiredFee[i]["room_number"].toString()) {
        check = 1;
        break;
      }
    }

    if (!check) {
      setErrorDeleteMessage("Vui lòng nhập đúng số phòng");
      setErrorDeleteModalOpen(true); // Show error modal
    } else {
      setConfirmationDeleteMessage(`Bạn có chắc chắn xoá khoản thu của phòng ${searchDeletedRoom}?`);
      setConfirmDeleteModalOpen(true); // Show confirmation modal
    }
  };

  const handleConfirmDeleting = async () => {
    setConfirmDeleteModalOpen(false); // Close confirmation modal
    try {
      var success = 1;
      // const success = await window.electronAPI.deleteCompulsoryFee(Number(searchDeletedRoom));
      if (success) {
        setSuccessDeleteModalOpen(true); // Show success modal
      } else {
        setErrorDeleteMessage("Thêm khoản thu không thành công.");
        setErrorDeleteModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    }

    fetchRequiredFee();
  };
  
  // for adding
  const [isErrorAddModalOpen, setErrorAddModalOpen] = useState(false);
  const [isConfirmAddModalOpen, setConfirmAddModalOpen] = useState(false);
  const [isSuccessAddModalOpen, setSuccessAddModalOpen] = useState(false);
  const [errorAddMessage, setErrorAddMessage] = useState('');
  const [confirmationAddMessage, setConfirmationAddMessage] = useState('');

  const [submitRoomNumber, setSubmitRoomNumber] = useState("");
  const [submitTransferrer, setSubmitTransferrer] = useState("");
  const [submitFeeName, setSubmitFeeName] = useState("");
  const [submitMoney, setSubmitMoney] = useState("");

  const handleSubmitAdding = async (e: any) => {
    e.preventDefault();
    
    var check = 0;

    for (const row of allRows) {
      if (submitRoomNumber == row["room_number"].toString()) {
        check = 1;
        break;
      }
    }

    if (!check) {
      setErrorAddMessage("Nhập sai số phòng.");
      setErrorAddModalOpen(true);
    } else {
      setConfirmationAddMessage(`Bạn có chắc chắn nộp tiền cho phòng ${submitRoomNumber}?`)
      setConfirmAddModalOpen(true);
    }
  };

  const handleConfirmAdding = async () => {
    setConfirmAddModalOpen(false); // Close confirmation modal

    try {
      const success = await window.electronAPI.addTransferFee(Number(submitRoomNumber), Number(submitMoney), 
                                                              submitFeeName, submitTransferrer, 
                                                              "Tự nguyện");

      if (success) {
        setSuccessAddModalOpen(true);

        roomFeeMap[submitRoomNumber.toString()].push({
          room_number: Number(submitRoomNumber),
          money: Number(submitMoney),
          fee_name: submitFeeName,
          transferer: submitTransferrer,
          fee_type: "Tự nguyện",
        });        

      } else {
        setErrorAddMessage("Nộp tiền không thành công.");
        setErrorAddModalOpen(true);
      }
    } catch(error) {
      console.log(error);
    }

    fetchRequiredFee();
  };

  //for editing
  const [searchEditedRoom, setSearchEditedRoom] = useState("");
  const [editedMoney, setEditedMoney] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedTransferrer, setEditedTransferrer] = useState("");

  const [isErrorEditModalOpen, setErrorEditModalOpen] = useState(false);
  const [isConfirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
  const [isSuccessEditModalOpen, setSuccessEditModalOpen] = useState(false);
  const [errorEditMessage, setErrorEditMessage] = useState('');
  const [confirmationEditMessage, setConfirmationEditMessage] = useState('');
  const [curEditMoney, setCurEditMoney] = useState('');
  const [curEditTransferrer, setCurEditTransferrer] = useState('');

  const handleSubmitEditing = async (e: any) => {
    e.preventDefault();
    
    var check = 0;

    for (var i = 0; i < requiredFee.length; i++) {
      if (searchEditedRoom == requiredFee[i]["room_number"].toString()) {
        setCurEditMoney(requiredFee[i]["money"].toString());
        // setCurEditTransferrer(requiredFee[i]["transferer"]);
        check = 1;
        break;
      }
    }

    if (!check) {
      setErrorEditMessage("Nhập sai số phòng.");
      setErrorEditModalOpen(true);
    } else {
      setConfirmationEditMessage(`Bạn có chắc chắn chỉnh sửa khoản thu của phòng ${searchEditedRoom}?`)
      setConfirmEditModalOpen(true);
    }
  };

  const handleConfirmEditing = async () => {
    setConfirmEditModalOpen(false); // Close confirmation modal

    try {
      var money = "", transferrer = "";
      if (editedMoney == "") money = curEditMoney;
      else money = editedMoney;

      if (editedTransferrer == "") transferrer = curEditTransferrer;
      else transferrer = editedTransferrer;

      const success = await window.electronAPI.editFee(Number(searchEditedRoom), Number(money), transferrer);

      if (success) {
        setSuccessEditModalOpen(true);
      } else {
        setErrorEditMessage("Chỉnh sửa khoản thu không thành công.");
        setErrorEditModalOpen(true);
      }
    } catch(error) {
      console.log(error);
    }

    fetchRequiredFee();
  };

  return (
    <AnimatedFrame>
      <Layout>
        {/* <SideBar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
        <Layout className="site-layout">
          <Header className="header"> </Header>
          <Content style={{ margin: '14px', background: '#fff' }}>
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Lịch sử nộp tiền</h2>
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
                        <th>Số tiền đã nộp</th>
                        <th>Tên khoản thu</th>
                        <th>Người nộp</th>
                        <th>Loại khoản thu</th>
                      </tr>
                    </thead>
                    <tbody>
                        {searchValues.searchRoomFee !== ""? (
                            roomFeeMap[searchValues.searchRoomFee]?.map((row, index) => (
                            <tr key={index}>
                                <td>{row.room_number}</td>
                                <td>{row.money}</td>
                                <td>{row.fee_name}</td>
                                <td>{row.transferer}</td>
                                <td>{row.fee_type}</td>
                            </tr>
                            ))
                        ) : (
                            requiredFee.map((row, index) => (
                                <tr key={index}>
                                  <td>{row.room_number}</td>
                                  <td>{row.money}</td>
                                  <td>{row.fee_name}</td>
                                  <td>{row.transferer}</td>
                                  <td>{row.fee_type}</td>
                                </tr>
                            ))
                        )}
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

export default HistoryPage;
