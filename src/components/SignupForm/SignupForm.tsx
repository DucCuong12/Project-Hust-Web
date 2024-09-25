import { useEffect, useState } from 'react';
import { IpcRendererEvent } from 'electron';
import { useNavigate } from 'react-router-dom';
import AnimatedFrame from '../../../utils/animation_page';
import { FaLock, FaUser } from 'react-icons/fa';
import './SignupForm.css';

// Define the structure of the payload and response
interface UserPayload {
  username: string;
  password: string;
}

interface IpcResponse {
  success: boolean;
  message: string;
}

function Signup() {
  const [input, setInput] = useState({
    username: '',
    password: '',
    retype_password: '',
  });
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (input.password !== input.retype_password) {
      setMessage('Password retype incorrect!');
    } else {
      try {
        const username = input.username;
        const password = input.password;
        await window.electronAPI.signup({
          username,
          password,
        });
      } catch (error) {
        setMessage('Signup failed');
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleClick = () => {
    navigate('/');
  };

  useEffect(() => {
    window.electronAPI.onMessage(
      'signup-response',
      (event: IpcRendererEvent, response: IpcResponse) => {
        if (response.success) {
          setMessage('Signup successful');
          //   alert('Signup successful!');
          navigate('/');
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
          <h1>Đăng ký</h1>
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
          <div className="input-box">
            <input
              type="password"
              name="retype_password"
              placeholder="Retype password"
              required
              value={input.retype_password}
              onChange={handleChange}
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <a href="#" onClick={handleClick}>
              Đã có tài khoản? Đăng nhập
            </a>
          </div>

          <button type="submit">Đăng ký</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </AnimatedFrame>
  );
}

export default Signup;
