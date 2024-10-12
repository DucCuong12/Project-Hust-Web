import React, { useState, useEffect } from 'react';
import { Flex, Button, Layout, Menu } from 'antd';
import {
  FaLeaf,
  FaSearch,
  FaHome,
  FaMoneyBillWave,
  FaUserAlt,
} from 'react-icons/fa';
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
  MenuUnfoldOutlined,
} from '@ant-design/icons';
// import './FeePage.css';
import AnimatedFrame from '../../../../utils/animation_page';
import { Link } from 'react-router-dom';
import { Transaction } from '../../../interface/interface.js';
import Dashboard from '../dashboard/Dashboard';

const { Header, Sider, Content } = Layout;

function FeePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transactions, setTransactions] = useState({});
  const [searchRoom, setSearchRoom] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');

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
      setError('Please fill in all fields');
      return;
    }
    if (isNaN(transferAmount)) {
      setError('Transfer amount must be a number');
      return;
    }
    setError('');
    setTransactions((prev) => ({
      ...prev,
      [roomNumber]: (prev[roomNumber] || 0) + parseFloat(transferAmount),
    }));
    setRoomNumber('');
    setTransferAmount('');
  };

  return (
    <AnimatedFrame>
      <Layout>
        <Dashboard collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout className="site-layout">
          <Header className="header"> </Header>
          <Content style={{ margin: '14px', background: '#fff' }}>
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transfer Money Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">
                    Transfer Money
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="roomNumber"
                      >
                        Room Number
                      </label>
                      <input
                        type="number"
                        id="roomNumber"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter room number"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="transferAmount"
                      >
                        Transfer Amount
                      </label>
                      <input
                        type="number"
                        id="transferAmount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter amount"
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
                      Add Transaction
                    </button>
                  </form>
                </div>

                {/* Room Payments Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Room Payments</h2>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={searchRoom}
                      onChange={(e) => setSearchRoom(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Search by room number"
                    />
                  </div>
                  {searchRoom && (
                    <p className="mt-4 text-lg">
                      Total amount transferred for room {searchRoom}: $
                      {searchResult !== null ? searchResult.toFixed(2) : '0.00'}
                    </p>
                  )}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Transaction Summary
                    </h3>
                    <table className="min-w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-4 py-2 text-left">Room Number</th>
                          <th className="px-4 py-2 text-right">
                            Total Amount Transferred
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(transactions).map(([room, amount]) => (
                          <tr key={room} className="border-t">
                            <td className="px-4 py-2">{room}</td>
                            <td className="px-4 py-2 text-right">
                              ${amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
