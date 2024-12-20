import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { IpcRendererEvent } from 'electron/renderer';
import { IpcResponse } from '../../interface/interface';
import { notification } from '../../../utils/toast_notification';
import ViewAccount from '../ViewAccount/ViewAccount';
import { User } from '../../interface/interface';
import AnimatedFrame from '../../../utils/animation_page';
import './AccountManage.css';

const AccountManage = () => {
  const [users, setUsers] = useState<User[]>([]);
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
  }, []);

  const handleListener = () => {
    window.electronAPI.clearListener('delete-user-response');
    window.electronAPI.onMessage(
      'delete-user-response',
      (event: IpcRendererEvent, response: IpcResponse) => {
        if (response.success) {
          notification.success(response.message);
          fetchUsers();
        } else {
          notification.error(response.message);
        }
      },
    );
  };

  const handleDelete = (id: number) => {
    handleListener();
    try {
      window.electronAPI.deleteUserAccount(id);
    } catch (err) {
      notification.error('Đã có lỗi xảy ra! Vui lòng thử lại sau.');
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
