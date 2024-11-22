import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import './output.css';
import AccountManage from '../components/AccountManage/AccountManage';
import HomePage from '../components/Pages/HomePage/HomePage';
import LogoutButton from '../components/LogoutButton/LogoutButton';
import FeePage from '../components/Pages/FeePage/FeePage';
import ContributionPage from '../components/Pages/ContributionPage/ContributionPage';
import SideBar from '../components/Pages/SideBar/SideBar';
import Dashboard from '../components/Pages/Dashboard/Dashboard';
import EditAccount from '../components/EditAccount/EditAccount';
import ConfirmLogout from '../components/ConfirmLogout/ConfirmLogout';
import ReceivableFee from '../components/Pages/ReceivableFee/ReceivableFee';

const AppInner = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      {location.pathname !== '/' && (
        <LogoutButton
          onAction={() => {
            setModalShow(true);
          }}
        />
      )}
      {isLogin ? (
        <div style={{ display: 'flex' }}>
          {!location.pathname.includes('/manage-account') && (
            <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
          )}
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/manage-account" element={<AccountManage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/feepage" element={<FeePage />} />
              <Route path="/contribute" element={<ContributionPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/receivable-fee" element={<ReceivableFee />} />
              <Route
                path="/manage-account/:id/edit"
                element={<EditAccount />}
              />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginForm onAction={setIsLogin} />} />
        </Routes>
      )}
      <ConfirmLogout
        show={modalShow}
        onHide={() => setModalShow(false)}
        onLogout={() => {
          setIsLogin(false);
          setModalShow(false);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
