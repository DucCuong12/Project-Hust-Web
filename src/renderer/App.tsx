import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
// import './App.css';
import { useLocation } from 'react-router-dom';
import SignupForm from '../components/SignupForm/SignupForm';
import AccountManage from '../components/AccountManage/AccountManage';
import HomePage from '../components/Pages/HomePage/HomePage';
import EditAccount from '../components/EditAccount/EditAccount';

export default function App() {
  return (
    <Router>
=      <Routes>
        {/* <Route path="/signup" element={<SignupForm />} /> */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/" element={<LoginForm />} /> */}
        {/* <Route path="/manage-account" element={<AccountManage />} /> */}
      </Routes>
    </Router>
  );
}
