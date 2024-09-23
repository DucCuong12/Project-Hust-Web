import React, { useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import AnimatedFrame from '../../../utils/animation_page';

interface UserPayload {
  username: string;
  password: string;
}

interface IpcResponse {
  success: boolean;
  message: string;
}

function LoginForm() {
  const [input, setInput] = useState({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const username = input.username;
      const password = input.password;
      await window.electronAPI.login({
        username,
        password,
      });
    } catch (error) {
      alert('Login failed');
    }
  };

  useEffect(() => {
    window.electronAPI.onMessage(
      'login-response',
      (event: IpcRendererEvent, response: IpcResponse) => {
        if (response.success) {
          setMessage('Login successful');
          alert('Login successful!');
          navigate('/home');
        } else {
          setMessage(response.message);
          // alert(response.message);
        }
      },
    );
  }, []);

  return (
    <AnimatedFrame>
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Hello World!</h1>
          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={input.username}
              onChange={handleChange}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={input.password}
              onChange={handleChange}
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit">Login</button>
        </form>
        {/* {message && <p>{message}</p>} */}
      </div>
    </AnimatedFrame>
  );
}

export default LoginForm;
