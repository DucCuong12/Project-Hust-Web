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
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import './HomePage.css';
import SideBar from '../SideBar/SideBar';
import ResidentTable from './ResidentTable';
import AnimatedFrame from '../../../../utils/animation_page';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <AnimatedFrame>
      <Layout>
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

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
  );
}

export default HomePage;
