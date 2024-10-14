import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { Button, ListGroup, Container, Row, Col } from 'react-bootstrap';
import SideBar from '../../Layout/SideBar'; // Assuming you have this component
import Layout from 'antd/es/layout/layout';

interface ContributionItem {
  id: number;
  amount: number;
  description: string;
}

const ContributionPage: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const navigate = useNavigate();

  const getContributions = () => {};

  //   useEffect(() => {
  //     // Fetch contributions from the backend
  //     getContributions().then((data) => setContributions(data));
  //   }, []);

  const handleItemClick = (id: number) => {
    // Navigate to a detailed page (to be created later)
    navigate(`/contribution/${id}`);
  };

  const handleAddClick = () => {
    // Navigate to the Add Contribution page
    navigate('/contribution/add');
  };

  return (
    <Layout>
      <Layout className="site-layout">
        <h2>Contributions</h2>
        <Button onClick={handleAddClick} className="mb-3">
          Add Contribution
        </Button>
        <ListGroup>
          {contributions.map((item) => (
            <ListGroup.Item
              key={item.id}
              action
              onClick={() => handleItemClick(item.id)}
            >
              {item.description} - ${item.amount}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Layout>
    </Layout>
  );
};

export default ContributionPage;
