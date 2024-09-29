import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IpcRendererEvent } from 'electron/renderer';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { IpcResponse, CreateAccountProps } from '../../interface/interface';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateAccount.css';

const CreateAccount: React.FC<CreateAccountProps> = ({ onAccountCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
  });

  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await window.electronAPI.signup({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
      });
      setFormData({
        username: '',
        password: '',
        email: '',
        name: '',
      });
    } catch (error) {
      setMessage('Signup failed');
    }
  };

  useEffect(() => {
    window.electronAPI.onMessage(
      'signup-response',
      (event: IpcRendererEvent, response: IpcResponse) => {
        if (response.success) {
          setMessage('Signup successful');
          onAccountCreated();
        } else {
          setMessage(response.message);
          // alert(response.message);
        }
      },
    );
  }, []);

  return (
    <Container className="mt-5 form-container">
      <h2>Create an Account</h2>
      <Form onSubmit={handleSubmit}>
        {/* Username Field */}
        <Form.Group as={Row} controlId="formUsername" className="mb-3">
          <Form.Label column sm={2}>
            Username
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Password Field */}
        <Form.Group as={Row} controlId="formPassword" className="mb-3">
          <Form.Label column sm={2}>
            Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Account Name Field */}
        <Form.Group as={Row} controlId="formName" className="mb-3">
          <Form.Label column sm={2}>
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Account
        </Button>
      </Form>
    </Container>
  );
};

export default CreateAccount;
