import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import AnimatedFrame from '../../../utils/animation_page';

function LoginForm() {
  const [input, setInput] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const validUsername = '1';
    const validPassword = '1';

    if (input.username === validUsername && input.password === validPassword) {
      navigate('/home');
    } else {
      // eslint-disable-next-line no-alert
      alert("Wrong login informations!");
    }
    // Handle login logic here
  };

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
      </div>
    </AnimatedFrame>
  );
}

export default LoginForm;
