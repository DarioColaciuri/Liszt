import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <>
      {!(location.pathname.startsWith('/dashboard'))  && (
        <div className='navbar-container'>
          <div className="logo">
            <Link to="/"><h1>Liszt</h1></Link>
          </div>
          <div className="buttons">
            {user ? (
              <>
                <button className='navbar-btn' onClick={handleLogout}>Logout</button>
                <Link to="/dashboard"><button className='navbar-btn'>Dashboard</button></Link>
              </>
            ) : (
              <>
                <Link to="/register"><button className='navbar-btn'>Getting started</button></Link>
                <Link to="/login"><button className='navbar-btn'>Login</button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;