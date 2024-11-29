import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DashboardData } from '../../../interface/interface';
import { Layout } from 'antd';
import GenderChart from './GenderChart';
import AgeChart from './AgeChart';
import AnimatedFrame from '../../../../utils/animation_page';
import UILayout from '../../../../utils/UILayout';

const Dashboard = () => {
  const { Header, Content } = Layout;
  const [data, setData] = useState<DashboardData>();
  const fetchNumberResidents = async () => {
    try {
      const data = await window.electronAPI.fetchResidentsData();
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchNumberResidents();
  }, []);

  return (
    <UILayout title="Thống kê dân cư">
      <Row>
        <Col lg={6} md={12}>
          <div className="gender-chart">
            <GenderChart data={data?.genderCount} />
          </div>
        </Col>
        <Col lg={6} md={12}>
          <div className="age-chart">
            <AgeChart data={data?.ageCount} />
          </div>
        </Col>
      </Row>
    </UILayout>
  );
};

export default Dashboard;
