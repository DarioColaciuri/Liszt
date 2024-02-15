import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './newtask.css';

const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10;
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
};

const NewTask = ({ user }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [owner, setOwner] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const uid = user.uid.toLowerCase();
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('uid', '==', uid));
        
        try {
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setOwner(userData.username);
          } else {
            console.error('No se encontró ningún documento con el UID correspondiente en Firestore.');
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario en Firestore:', error.message);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        console.error('No user logged in.');
        return;
      }

      const uid = user.uid.toLowerCase();
      const tasksCollectionRef = collection(db, 'tasks');

      let newTaskId;
      let taskExists = true;

      while (taskExists) {
        newTaskId = generateRandomId();
        const taskDocRef = doc(tasksCollectionRef, newTaskId);
        const taskDoc = await getDoc(taskDocRef);
        taskExists = taskDoc.exists();
      }

      await addDoc(tasksCollectionRef, {
        taskId: newTaskId,
        title,
        description,
        date,
        expireDate,
        isCompleted,
        isImportant,
        isShared,
        owner,
        uid,
        sharedWith: '',
      });

      navigate('/dashboard/alltasks');
    } catch (error) {
      console.error('Error al agregar la tarea:', error.message);
    }
  };

  return (
    <div className='new-task-container'>
      <h2>New Task</h2>
      <form className='task-form' onSubmit={handleAddTask}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description:</label>
        <textarea className='description' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Expire Date:</label>
        <input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} />

        {/* <label>Is Completed:</label>
        <input type="checkbox" checked={isCompleted} onChange={() => setIsCompleted(!isCompleted)} />

        <label>Is Important:</label>
        <input type="checkbox" checked={isImportant} onChange={() => setIsImportant(!isImportant)} />

        <label>Is Shared:</label>
        <input type="checkbox" checked={isShared} onChange={() => setIsShared(!isShared)} /> */}

        <button className='addTask-btn' type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default NewTask;