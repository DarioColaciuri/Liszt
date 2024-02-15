import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import "./Dashboard.css"
import { useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { getDocs, collection, query, where } from 'firebase/firestore';

const Dashboard = ({ setUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid.toLowerCase();
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('uid', '==', uid));

        try {
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUsername(userData.username);
          } else {
            console.error('No se encontró ningún documento con el UID correspondiente en Firestore.');
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario en Firestore:', error.message);
        }
      }
    };

    checkUser();
  }, []);

  return (
    <div className='content'>
      <div className='dashboard-panel'>
        <div className="user">
          <img className='user-img' src="ELDARO.png" alt="user photo profile"/>
          <h2>{username}</h2>
          <Link to="/dashboard/configure"><button className='config-btn'><i className="fa fa-cog" aria-hidden="true"></i></button></Link>
        </div>
        <div className="dashboard-categories">
          <ul>
            <li><Link to="/dashboard/newtask"><button className='navbar-btn'><i className="fa fa-plus"></i> New</button></Link></li>
            <li><Link to="/dashboard/alltasks"><button className='navbar-btn'>All tasks</button></Link></li>
            <li><Link to="/dashboard/important"><button className='navbar-btn'>Important</button></Link></li>
            <li><Link to="/dashboard/completed"><button className='navbar-btn'>Completed</button></Link></li>
          </ul>
        </div>
        <button className='navbar-btn' onClick={handleLogout}>Logout</button>
      </div>
      <div className="components">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;