import { Layout } from 'antd';
import './HomePage.css';
import ResidentTable from './ResidentTable';
import AnimatedFrame from '../../../../utils/animation_page';

const { Header, Content } = Layout;

function HomePage() {
  return (
    <div className="home">
      <AnimatedFrame>
        <Layout>
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
