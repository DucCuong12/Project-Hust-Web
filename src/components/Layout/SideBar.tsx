import { Flex, Button, Layout, Menu } from 'antd';
import { FaLeaf } from 'react-icons/fa';
import { useState } from 'react';
import {
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  FormOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      theme="dark"
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="sider"
    >
      <>
        <Flex align="center" justify="center">
          <div className="logo">
            <FaLeaf />
          </div>
        </Flex>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          className="menu-bar"
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/home">Trang chủ</Link>
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
          <Menu.Item key="6" icon={<DollarCircleOutlined />}>
            <Link to="/feepage">Khoản thu</Link>
          </Menu.Item>
        </Menu>
      </>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="triger-btn"
      />
    </Sider>
  );
};

export default SideBar;
