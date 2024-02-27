import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import TaskCard from './TaskCard';
import "./alltasks.css";

const Important = ({ user }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (user) {
        const uid = user.uid.toLowerCase();
        const tasksCollectionRef = collection(db, 'tasks');
        const q = query(tasksCollectionRef, where('uid', '==', uid));

        try {
          const querySnapshot = await getDocs(q);
          const userTasks = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
          setTasks(userTasks);
        } catch (error) {
          console.error('Error fetching user tasks:', error.message);
        }
      }
    };

    fetchUserTasks();
  }, [user]);

  const handleDeleteTask = async (taskId) => {
    try {
      const updatedTasks = tasks.filter(t => t.taskId !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating local state:', error.message);
    }
  };

  const handleUpdateTask = (taskId, updatedInfo) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.uid === taskId ? { ...task, ...updatedInfo } : task))
    );
  };


  return (
    <div className="all-tasks-container">
      <h2 className='all-tasks-title'>Important</h2>
      <div className="task-card-container">
      {tasks
          .filter(task => task.isImportant === true)
          .map((task, index) => (
            <TaskCard key={`${task.uid}_${index}`} task={task} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
          ))
        }
      </div>
    </div>
  );
};


export default Important;