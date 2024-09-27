import React, { useState, useEffect } from 'react';
import ViewAccount from '../ViewAccount/ViewAccount';
import CreateAccount from '../CreateAccount/CreateAccount';
import { User } from '../../interface/interface';

const AccountManage = () => {
  const [users, setUsers] = useState<User[]>([]);

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

  const handleAccountCreated = () => {
    fetchUsers();
  };

  return (
    <div>
      <h1>Account Management</h1>

      {/* CreateAccount component with account creation callback */}
      <CreateAccount onAccountCreated={handleAccountCreated} />

      {/* ViewAccount displays the updated list of users */}
      <ViewAccount users={users} />
    </div>
  );
};

export default AccountManage;
