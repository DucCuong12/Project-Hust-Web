import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import './App.css';
import { useLocation } from 'react-router-dom';
import AnimatedFrame from '../../utils/animation_page';

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
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Hello />} />
      </Routes>
    </Router>
  );
}
