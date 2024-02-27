import React, { useState, useEffect } from 'react';
import { deleteDoc, updateDoc, collection, query, where, getDocs, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TaskCard.css';

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [taskData, setTaskData] = useState(task || {});
  const [shareInput, setShareInput] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const { taskId, title, description, date, expireDate, isCompleted, isImportant, isShared, owner, sharedWith } = taskData;

  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const expireDate = new Date(taskData.expireDate);
      const timeDifference = expireDate - now;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setCountdown(`Expires in ${days} days ${hours}:${minutes}:${seconds}`);
      } else {
        setCountdown('Expired');
      }
    };
    calculateCountdown();

    const countdownInterval = setInterval(() => {
      calculateCountdown();
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [taskData.expireDate]);

  const handleDeleteTask = async () => {
    try {
      const q = query(collection(db, 'tasks'), where('taskId', '==', taskId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const taskDoc = querySnapshot.docs[0];
        await deleteDoc(doc(db, 'tasks', taskDoc.id));
        onDelete(taskId);

        toast.success('Task deleted successfully!');
      } else {
        toast.error('Error deleting task. Task not found.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(`Error deleting task. Please try again. Details: ${error.message}`);
    }
  };

  const handleToggleCompleted = async () => {
    try {
      const tasksCollectionRef = collection(db, 'tasks');
      const q = query(tasksCollectionRef, where('taskId', '==', taskId));

      const querySnapshot = await getDocs(q);

      const updatePromises = [];
      querySnapshot.forEach((taskDoc) => {
        const docRef = doc(db, 'tasks', taskDoc.id);
        const updatePromise = updateDoc(docRef, { isCompleted: !isCompleted });
        updatePromises.push(updatePromise);
      });

      await Promise.all(updatePromises);

      setTaskData((prevTaskData) => ({ ...prevTaskData, isCompleted: !isCompleted }));

      onUpdate(taskId, { isCompleted: !isCompleted });

      toast.success(`Task marked as ${!isCompleted ? 'completed' : 'not completed'}`);
    } catch (error) {
      console.error('Error toggling completed status:', error);
      toast.error(`Error toggling completed status. Please try again. Details: ${error.message}`);
    }
  };

  const handleToggleImportant = async () => {
    try {
      const tasksCollectionRef = collection(db, 'tasks');
      const q = query(tasksCollectionRef, where('taskId', '==', taskId));

      const querySnapshot = await getDocs(q);

      const updatePromises = [];
      querySnapshot.forEach((taskDoc) => {
        const docRef = doc(db, 'tasks', taskDoc.id);
        const updatePromise = updateDoc(docRef, { isImportant: !isImportant });
        updatePromises.push(updatePromise);
      });

      await Promise.all(updatePromises);

      setTaskData((prevTaskData) => ({ ...prevTaskData, isImportant: !isImportant }));

      onUpdate(taskId, { isImportant: !isImportant });

      toast.success(`Task marked as ${!isImportant ? 'important' : 'not important'}`);
    } catch (error) {
      console.error('Error toggling important status:', error);
      toast.error(`Error toggling important status. Please try again. Details: ${error.message}`);
    }
  };

  const handleShareToggle = () => {
    setIsSharing(!isSharing);
  };

  const handleShareInputChange = (e) => {
    setShareInput(e.target.value);
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();

    try {
      const tasksCollectionRef = collection(db, 'tasks');
      const q = query(tasksCollectionRef, where('taskId', '==', taskId));

      const querySnapshot = await getDocs(q);

      const updatePromises = [];
      querySnapshot.forEach((taskDoc) => {
        const docRef = doc(db, 'tasks', taskDoc.id);
        const updatePromise = updateDoc(docRef, { sharedWith: shareInput, isShared: true });
        updatePromises.push(updatePromise);
      });

      await Promise.all(updatePromises);

      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        sharedWith: shareInput,
        isShared: true
      }));

      toast.success(`Task shared with: ${shareInput}`);
      setIsSharing(false);
    } catch (error) {
      console.error('Error sharing task:', error);
      toast.error(`Error sharing task. Please try again. Details: ${error.message}`);
    }
  };

  const handleUnshare = async () => {
    try {
      const tasksCollectionRef = collection(db, 'tasks');
      const q = query(tasksCollectionRef, where('taskId', '==', taskId));

      const querySnapshot = await getDocs(q);

      const updatePromises = [];
      querySnapshot.forEach((taskDoc) => {
        const docRef = doc(db, 'tasks', taskDoc.id);
        const updatePromise = updateDoc(docRef, { sharedWith: '', isShared: false });
        updatePromises.push(updatePromise);
      });

      await Promise.all(updatePromises);

      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        sharedWith: '',
        isShared: false
      }));

      toast.success('Task unshared successfully!');
    } catch (error) {
      console.error('Error unsharing task:', error);
      toast.error(`Error unsharing task. Please try again. Details: ${error.message}`);
    }
  };

  return (
    <div className={`task-card ${isImportant ? 'important' : ''} ${isCompleted ? 'completed' : ''}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="date">
        <p>{date}</p>
        {/* <p>Expire Date: {expireDate}</p> */}
      </div>
      <div className='countdown'>{countdown}</div>

      {/* <p>Completed: {isCompleted ? 'Yes' : 'No'}</p>
      <p>Important: {isImportant ? 'Yes' : 'No'}</p>
      <p>Shared: {isShared ? 'Yes' : 'No'}</p> */}

      <p>Owner: {owner}</p>

      {isShared && sharedWith !== '' && (
        <div className='shared-with'>
          <p>Shared with:</p> 
          <div className="each-shared"> 
            <p>{sharedWith}</p>
            <button className='x-button' onClick={handleUnshare}>X</button>
          </div>
        </div>
      )}
      <div className="buttons">
        <button className='action-btn' onClick={handleToggleCompleted}><i className="fa fa-check"></i></button>
        <button className='action-btn' onClick={handleToggleImportant}><i className="fa fa-exclamation"></i></button>
        <button className='action-btn' onClick={handleDeleteTask}><i className="fa fa-trash" /></button>
      </div>

      {isSharing ? (
        <form className='shareTo' onSubmit={handleShareSubmit}>
          <input
            className='shareTo-input'
            type="text"
            value={shareInput}
            onChange={handleShareInputChange}
            placeholder="Enter username"
          />
          <button className="shareTo-btn-share" type="submit">Share</button>
        </form>
      ) : (
        <button className="shareTo-btn" onClick={handleShareToggle}>Share To</button>
      )}
    </div>
  );
}

export default TaskCard;

