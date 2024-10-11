import React, { useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FaLock, FaUser, FaEyeSlash } from 'react-icons/fa';
import AnimatedFrame from '../../../utils/animation_page';
import { IpcResponse } from '../../interface/interface';
import './LoginForm.css';

function LoginForm() {
  const [input, setInput] = useState({
    username: '',
    password: '',
    admin: false,
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prevInput) => ({
      ...prevInput,
      admin: event.target.checked,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage('');
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

  const handleToggle = () => {
    const inputNode = document.getElementById('myPassword') as HTMLElement;
    if (inputNode.type === 'password') inputNode.type = 'text';
    else inputNode.type = 'password';
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
      <div className="wrapper login">
        <form onSubmit={handleSubmit}>
          <h1>Đăng nhập</h1>
          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
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
              id="myPassword"
              placeholder="Mật khẩu"
              required
              value={input.password}
              onChange={handleChange}
            />
            <div className="icon">
              <FaEyeSlash className="icon-left" onClick={handleToggle} />
              <FaLock />
            </div>
          </div>

          <div className="remember-forgot">
            <input
              type="checkbox"
              id="myCheckbox"
              checked={input.admin}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="myCheckbox">
              Đăng nhập với tư cách quản trị viên
            </label>
          </div>

          <button type="submit">Đăng nhập</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </AnimatedFrame>
  );
}

export default LoginForm;
