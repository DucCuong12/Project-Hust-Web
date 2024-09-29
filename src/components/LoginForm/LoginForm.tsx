import React, { useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import AnimatedFrame from '../../../utils/animation_page';
import { IpcResponse } from '../../interface/interface';

function LoginForm() {
  const [input, setInput] = useState({
    username: '',
    password: '',
    admin: false,
  });

  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleClick = (e: any) => {
    navigate('/signup');
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prevInput) => ({
      ...prevInput,
      admin: event.target.checked,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await window.electronAPI.login({
        username: input.username,
        password: input.password,
        admin: input.admin,
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
          if (response.message === 'Admin successful')
            navigate('/manage-account');
          else navigate('/home');
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
          <h1>Đăng nhập</h1>
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

          <div className="">
            <input
              type="checkbox"
              id="myCheckbox"
              checked={input.admin}
              onChange={handleCheckboxChange}
            />
            <label>Đăng nhập với tư cách quản trị viên</label>
          </div>

          <div className="remember-forgot">
            <a href="#" onClick={handleClick}>
              Chưa có tài khoản? Đăng kí tại đây
            </a>
          </div>

          <button type="submit">Đăng nhập</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </AnimatedFrame>
  );
}

export default LoginForm;
