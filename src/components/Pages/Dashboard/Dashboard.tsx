import { getTotalResidents } from '../../../db/HandleData';

const Dashboard = () => {
  const msg = getTotalResidents();
  //   const msg = 'Null';
  return <div>${msg}</div>;
};

export default Dashboard;
