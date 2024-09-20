import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  return (
    <div>
      <h2>Hello World!</h2>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LoginForm />} />
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
