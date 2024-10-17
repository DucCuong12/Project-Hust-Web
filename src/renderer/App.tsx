import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
// import './App.css';
import './output.css';
import SignupForm from '../components/SignupForm/SignupForm';
import AccountManage from '../components/AccountManage/AccountManage';
import HomePage from '../components/Pages/HomePage/HomePage';
import FeePage from '../components/Pages/FeePage/FeePage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/signup" element={<SignupForm />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/feepage" element={<FeePage />} />
        {/* <Route path="/" element={<LoginForm />} /> */}
        {/* <Route path="/manage-account" element={<AccountManage />} /> */}
      </Routes>
    </Router>
  );
}
