import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DashboardData } from '../../../interface/interface';
import { Layout } from 'antd';
import GenderChart from './GenderChart';
import AgeChart from './AgeChart';
import AnimatedFrame from '../../../../utils/animation_page';

const Dashboard = () => {
  const { Header, Content } = Layout;
  const [data, setData] = useState<DashboardData>();
  const fetchNumberResidents = async () => {
    try {
      const data = await window.electronAPI.fetchResidentsData();
      console.log(data);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchNumberResidents();
  }, []);

  return (
    <AnimatedFrame>
      <Layout>
        <Header className="header"> </Header>
        <Content style={{ margin: '14px', background: '#fff' }}>
          <div
            className="site-layout-background"
            style={{ padding: 16, minHeight: 360 }}
          >
            <div className="content">
              <Container fluid>
                <Row>
                  <h3 style={{ marginBottom: '24px' }}>Thống kê dân cư</h3>
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
              </Container>
            </div>
          </div>
        </Content>
      </Layout>
    </AnimatedFrame>
  );
};

export default Dashboard;
