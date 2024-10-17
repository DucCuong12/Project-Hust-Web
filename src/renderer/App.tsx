import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import AccountManage from '../components/AccountManage/AccountManage';
import HomePage from '../components/Pages/HomePage/HomePage';
import LogoutButton from '../components/LogoutButton/LogoutButton';
import FeePage from '../components/Pages/FeePage/FeePage';
import ContributionPage from '../components/Pages/ContributionPage/ContributionPage';
import SideBar from '../components/Layout/SideBar';
import Dashboard from '../components/Pages/Dashboard/Dashboard';

const AppInner = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div>
      {location.pathname !== '/' && <LogoutButton onAction={setIsLogin} />}
      {isLogin ? (
        <div style={{ display: 'flex' }}>
          {location.pathname !== '/manage-account' && <SideBar />}
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/manage-account" element={<AccountManage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/feepage" element={<FeePage />} />
              <Route path="/contribute" element={<ContributionPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<LoginForm onAction={setIsLogin} />} />
        </Routes>
      )}
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
