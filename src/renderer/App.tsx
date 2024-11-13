import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
// import './App.css';
import './output.css';
import SignupForm from '../components/SignupForm/SignupForm';
import AccountManage from '../components/AccountManage/AccountManage';
import HomePage from '../components/Pages/HomePage/HomePage';
import LogoutButton from '../components/LogoutButton/LogoutButton';
import FeePage from '../components/Pages/FeePage/FeePage';
import ContributionPage from '../components/Pages/ContributionPage/ContributionPage';
import SideBar from '../components/Pages/SideBar/SideBar';
import Dashboard from '../components/Pages/Dashboard/Dashboard';
import EditAccount from '../components/EditAccount/EditAccount';

const AppInner = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div>
      {location.pathname !== '/' && <LogoutButton onAction={setIsLogin} />}
      {isLogin ? (
        <div style={{ display: 'flex' }}>
          {/* <SideBar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
          {/* {!location.pathname.includes('/manage-account') && <SideBar />} */}
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/manage-account" element={<AccountManage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/feepage" element={<FeePage />} />
              <Route path="/contribute" element={<ContributionPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/manage-account/:id/edit"
                element={<EditAccount />}
              />
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
