import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { HandleLoginState } from '../../interface/interface';
import './LogoutButton.css';

const LogoutButton: React.FC<HandleLoginState> = ({ onAction }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    onAction(false);
    navigate('/');
  };
  return (
    <Button variant="danger" onClick={handleLogout} className="logout-button">
      Đăng xuất
    </Button>
  );
};

export default LogoutButton;
