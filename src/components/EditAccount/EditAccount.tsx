import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { EditUser } from '../../interface/interface';

const EditAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idNumber = id ? parseInt(id) : 0;

  const [user, setUser] = useState<EditUser>({
    username: '',
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await window.electronAPI.editUserAccount(
        {
          username: user.username,
          password: user.password,
          email: user.email,
          name: user.name,
        },
        idNumber,
      );
      navigate('/manage-account');
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const result = await window.electronAPI.fetchUser(idNumber);
      const data: EditUser = {
        ...result[0],
        password: '',
      };
      setUser(data);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container className="mt-5 form-container">
      <h2>Edit an Account</h2>
      <Form onSubmit={handleSubmit}>
        {/* Username Field */}
        <Form.Group as={Row} controlId="formUsername" className="mb-3">
          <Form.Label column sm={2}>
            Tên đăng nhập
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Password Field */}
        <Form.Group as={Row} controlId="formPassword" className="mb-3">
          <Form.Label column sm={2}>
            Mật khẩu mới (để trống nếu không muốn thay đổi)
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        {/* Account Name Field */}
        <Form.Group as={Row} controlId="formName" className="mb-3">
          <Form.Label column sm={2}>
            Tên tài khoản
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Sửa
        </Button>
      </Form>
    </Container>
  );
};

export default EditAccount;
