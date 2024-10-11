import React, { useState, useEffect } from 'react';
import { Flex, Button, Layout, Menu } from 'antd';
import {  FaLeaf, FaSearch, FaHome, FaMoneyBillWave, FaUserAlt  } from "react-icons/fa";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import {
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  FormOutlined,
  NotificationOutlined,
  DollarCircleOutlined,  
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
// import './FeePage.css';
import AnimatedFrame from '../../../../utils/animation_page';
import { Link } from 'react-router-dom'; 
import { Transaction } from '../../../interface/interface.js';

const { Header, Sider, Content } = Layout;

function FeePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transactions, setTransactions] = useState({});
  const [searchRoom, setSearchRoom] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");


  useEffect(() => {
    if (searchRoom) {
      const result = transactions[searchRoom] || 0;
      setSearchResult(result);
    } else {
      setSearchResult(null);
    }
  }, [searchRoom, transactions]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomNumber || !transferAmount) {
      setError("Please fill in all fields");
      return;
    }
    if (isNaN(transferAmount)) {
      setError("Transfer amount must be a number");
      return;
    }
    setError("");
    setTransactions((prev) => ({
      ...prev,
      [roomNumber]: (prev[roomNumber] || 0) + parseFloat(transferAmount),
    }));
    setRoomNumber("");
    setTransferAmount("");
  };

  return (
    <AnimatedFrame>
      <Layout>
        <Sider
          theme="dark"
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="sider"
        >
          <>
            <Flex align="center" justify="center">
              <div className='logo'>
                <FaLeaf />
              </div> 
            </Flex>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" className="menu-bar">
              <Menu.Item key="1" icon={<HomeOutlined />}>
                Trang chủ 
              </Menu.Item>
              <Menu.Item key="2" icon={<UserOutlined />}>
                Tài khoản
              </Menu.Item>
              <Menu.Item key="3" icon={<BarChartOutlined />}>
                Thống kê
              </Menu.Item>
              <Menu.Item key="4" icon={<FormOutlined />}>
                Báo cáo
              </Menu.Item>
              <Menu.Item key="5" icon={<NotificationOutlined />}>
                Thông báo
              </Menu.Item>
              <Menu.Item key="6" icon={<DollarCircleOutlined />} > 
                <Link to="/feepage">Khoản thu</Link>
              </Menu.Item>
            </Menu>
          </>

          <Button 
            type='text' 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className='triger-btn'
          />
        </Sider>

        <Layout className="site-layout">
          <Header className="header"> </Header>
          <Content style={{ margin: '14px', background: '#fff' }}>
            <div
              className="site-layout-background"
              style={{ padding: 16, minHeight: 360 }}
            >
                <div className="min-h-screen bg-gray-100">
                  <div className="container mx-auto p-6">
                      {/* <main className="container mx-auto mt-8 px-4"> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <h4 className="text-l font-semibold mb-4">Room Number</h4>
                                    <input
                                        type="text"
                                        id="roomNumber"
                                        value={roomNumber}
                                        onChange={(e) => setRoomNumber(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter room number"
                                        aria-label="Room Number"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-l font-semibold mb-4">Transfer Amount</h4>
                                    <input
                                        type="number"
                                        id="transferAmount"
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        className="w-48 p-2 border rounded-md text-lg"
                                        placeholder="Enter amount money"
                                        aria-label="Amount Transferred"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                type="submit"
                                className="w-full bg-blue-600 text-black py-2 px-4 rounded-md hover:bg-blue-700"
                                >
                                Add Transaction
                                </button>
                            </form>
                        </div>

                        {/* Search Transactions Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Search Transaction</h2>
                            <div className="mb-4">
                                  <input
                                  type="text"
                                  value={searchRoom}
                                  onChange={(e) => setSearchRoom(e.target.value)}
                                  className="w-48 p-2 pr-10 border rounded-md"
                                  placeholder="Search by room number"
                                  aria-label="Search Room"
                                  />
                                  {/* <FaSearch className="absolute right-3 top-3 text-gray-400" /> */}
                            </div>
                            {searchResult !== null && (
                                <p className="mt-4 text-lg">
                                Total amount transferred for room {searchRoom}: ${searchResult.toFixed(2)}
                                </p>
                            )}
                        </div>

                        {/* Transaction Summary Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4">Transaction Summary</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Room Number</th>
                                        <th className="py-3 px-6 text-right">Total Amount Transferred</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm font-light">
                                        {Object.entries(transactions).map(([room, amount]) => (
                                        <tr key={room} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">{room}</td>
                                            <td className="py-3 px-6 text-right">${amount.toFixed(2)}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                      {/* </main> */}
                  </div>  
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </AnimatedFrame>
  );
}

export default FeePage;