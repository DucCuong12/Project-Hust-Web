import React from 'react';
import { Table } from 'react-bootstrap';
import { ViewAccountProps } from '../../interface/interface';

const ViewAccount: React.FC<ViewAccountProps> = ({ users }) => {
  console.log(users);
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ViewAccount;
