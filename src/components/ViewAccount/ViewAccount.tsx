import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { ViewAccountProps } from '../../interface/interface';
import { useNavigate } from 'react-router-dom';

const ViewAccount: React.FC<ViewAccountProps> = ({ users }) => {
  const navigate = useNavigate();

  const handleEdit = (e: any, id: number) => {
    e.preventDefault();
    navigate(`/${id}/edit`);
  };

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
            <td>
              <Button
                variant="outline-primary"
                onClick={(e) => {
                  handleEdit(e, user.id);
                }}
              >
                Sửa
              </Button>
              <Button variant="outline-danger">Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ViewAccount;
