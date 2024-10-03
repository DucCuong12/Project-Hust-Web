import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ViewAccount from '../ViewAccount/ViewAccount';
import CreateAccount from '../CreateAccount/CreateAccount';
import { User } from '../../interface/interface';

const AccountManage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const location = useLocation();

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

  const handleAccountModified = () => {
    fetchUsers();
  };

  console.log('Re-rendered!');

  return (
    <div>
      <h1>Account Management</h1>

      {/* CreateAccount component with account creation callback */}
      <CreateAccount onAccountCreated={handleAccountModified} />

      {/* ViewAccount displays the updated list of users */}
      <ViewAccount users={users} onAccountModified={handleAccountModified} />
    </div>
  );
};

export default AccountManage;
