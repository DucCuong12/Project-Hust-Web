import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import './App.css';
import { useLocation } from 'react-router-dom';
import AnimatedFrame from '../../utils/animation_page';
import SignupForm from '../components/SignupForm/SignupForm';
import CreateAccount from '../components/CreateAccount/CreateAccount';

function Hello() {
  return (
    <AnimatedFrame>
      <div>
        <h2>Hello World!</h2>
      </div>
    </AnimatedFrame>
  );
}
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/home" element={<Hello />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}
