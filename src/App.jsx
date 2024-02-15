import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar/Navbar';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { auth } from './firebase/config';
import { ToastContainer } from 'react-toastify';
import './reset.css';
import AllTasks from './components/Dashboard/AllTasks';
import Completed from './components/Dashboard/Completed';
import Important from './components/Dashboard/Important';
import Configure from './components/Dashboard/Configure';
import NewTask from './components/Dashboard/NewTask';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <>
        <ToastContainer />
        <Navbar user={user} />
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <div>
                  <h1>Welcome to Liszt</h1>
                </div>
              )
            }
          />

          <Route path="/dashboard" element={<Dashboard setUser={setUser} />}>
            <Route index element={<AllTasks user={user} />} />
            <Route path="alltasks" element={<AllTasks user={user} />} />
            <Route path="important" element={<Important user={user} />} />
            <Route path="completed" element={<Completed user={user} />} />
            <Route path="newtask" element={<NewTask user={user} />} />
            <Route path="configure" element={<Configure user={user} /> } />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;