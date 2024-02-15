import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { toast } from 'react-toastify';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = loginData;
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión. Usuario o contraseña no válidos.');
    }
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
      <div className="container-general">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={loginData.email}
            onChange={handleInputChange}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleInputChange}
          />
          <button type="submit" className="iniciar">
            Login
          </button>
        </form>
      </div>
  );
};

export default Login;