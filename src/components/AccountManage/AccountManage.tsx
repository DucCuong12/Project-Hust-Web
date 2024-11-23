import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ViewAccount from '../ViewAccount/ViewAccount';
import { User } from '../../interface/interface';
import AnimatedFrame from '../../../utils/animation_page';
import './AccountManage.css';

const AccountManage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const result = await window.electronAPI.fetchUser();
      setUsers(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [location]);

  const handleDelete = (id: number) => {
    try {
      window.electronAPI.deleteUserAccount(id);
    } catch (err) {
      console.log('Server error!');
    } finally {
      fetchUsers();
    }
  };

  return (
    <AnimatedFrame>
      <h1 className="account-manage-header">Quản lý tài khoản</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '80%',
            marginTop: '24px',
          }}
        >
          <Button
            variant="outline-primary"
            onClick={() => navigate('/manage-account/create-account')}
          >
            Thêm tài khoản mới
          </Button>
          <ViewAccount users={users} handleDelete={handleDelete} />
        </div>
      </div>
    </AnimatedFrame>
  );
};

export default AccountManage;
