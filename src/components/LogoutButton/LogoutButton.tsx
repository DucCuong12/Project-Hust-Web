import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './LogoutButton.css';

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };
  return (
    <Button variant="danger" onClick={handleLogout} className="logout-button">
      Đăng xuất
    </Button>
  );
};

export default LogoutButton;
