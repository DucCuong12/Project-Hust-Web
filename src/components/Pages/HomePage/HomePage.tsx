import React, { useState } from 'react';
import { Flex, Button, Layout, Menu } from 'antd';
import { FaLeaf } from 'react-icons/fa';
import {
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  FormOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import './HomePage.css';
import ResidentTable from './ResidentTable';
import AnimatedFrame from '../../../../utils/animation_page';

const { Header, Sider, Content } = Layout;

function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="home">
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
                <Menu.Item key="6" icon={<QuestionCircleOutlined />}>
                  Hỗ trợ
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

          <Layout className="site-layout">
            <Header className="header"> </Header>
            <Content style={{ margin: '14px', background: '#fff' }}>
              <div
                className="site-layout-background"
                style={{ padding: 16, minHeight: 360 }}
              >
                <div className="content">
                  <ResidentTable />
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </AnimatedFrame>
    </div>
  );
}

export default HomePage;
