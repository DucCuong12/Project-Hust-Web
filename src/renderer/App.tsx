import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
  BrowserRouter,
} from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import AccountManage from '../components/AccountManage/AccountManage';
import HomePage from '../components/Pages/HomePage/HomePage';
import LogoutButton from '../components/LogoutButton/LogoutButton';

const AppInner = () => {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== '/' && <LogoutButton />}
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/manage-account" element={<AccountManage />} />
      </Routes>
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
