import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { ViewAccountProps } from '../../interface/interface';
import { useNavigate } from 'react-router-dom';

const ViewAccount: React.FC<ViewAccountProps> = ({
  users,
  onAccountModified,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = (id: number) => {
    try {
      window.electronAPI.deleteUserAccount(id);
    } catch (err) {
      console.log('Server error!');
    }
    handleClose();
    onAccountModified();
  };

  const navigate = useNavigate();

  const handleEdit = (e: any, id: number) => {
    e.preventDefault();
    navigate(`/${id}/edit`);
  };

  return (
    <div>
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
                <Button variant="outline-danger" onClick={handleShow}>
                  Xóa
                </Button>
              </td>
              <Modal
                show={show}
                onHide={handleClose}
                style={{ color: 'black' }}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this item?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Dismiss
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewAccount;
