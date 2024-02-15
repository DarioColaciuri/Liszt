import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import TaskCard from './TaskCard';
import './alltasks.css';

const Completed = ({ user }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (user) {
        const uid = user.uid.toLowerCase();
        const tasksCollectionRef = collection(db, 'tasks');
        const q = query(tasksCollectionRef, where('uid', '==', uid), where('isCompleted', '==', true));

        try {
          const querySnapshot = await getDocs(q);
          const completedTasks = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
          setTasks(completedTasks);
        } catch (error) {
          console.error('Error fetching completed tasks:', error.message);
        }
      }
    };

    fetchCompletedTasks();
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
    <div className="completed-tasks-container">
      <h2 className='completed-tasks-title'>Completed Tasks</h2>
      <div className="task-card-container">
        {tasks.map((task, index) => (
          <TaskCard key={`${task.uid}_${index}`} task={task} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
        ))}
      </div>
    </div>
  );
};

export default Completed;