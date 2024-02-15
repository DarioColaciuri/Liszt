import React, { useEffect, useState } from 'react';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import TaskCard from './TaskCard';
import "./alltasks.css";
import 'react-toastify/dist/ReactToastify.css';

const AllTasks = ({ user }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (user) {
        const uid = user.uid.toLowerCase();
        let username;
        const userCollectionRef = collection(db, 'users');
        const qUser = query(userCollectionRef, where('uid', '==', uid));
    
        try {
          const querySnapshotUser = await getDocs(qUser);
          if (querySnapshotUser.size > 0) {
            username = querySnapshotUser.docs[0].data().username;
            const tasksCollectionRef = collection(db, 'tasks');
    
            const qUserTasks = query(
              tasksCollectionRef,
              where('uid', '==', uid),
              where('uid', '!=', null),
            );
    
            const qSharedTasks = query(
              tasksCollectionRef,
              where('sharedWith', '==', username),
            );
    
            const querySnapshotUserTasks = await getDocs(qUserTasks);
            const querySnapshotSharedTasks = await getDocs(qSharedTasks);
    
            const userTasks = querySnapshotUserTasks.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
            const sharedTasks = querySnapshotSharedTasks.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    
            const combinedTasks = [...userTasks, ...sharedTasks];
    
            const filteredTasks = combinedTasks.filter((task) => !task.isCompleted);
            setTasks(filteredTasks);
          } else {
            console.warn('User not found in users collection');
          }
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
      <h2 className='all-tasks-title'>All Tasks</h2>
      <div className="task-card-container">
        {tasks.map((task, index) => (
          <TaskCard key={`${task.uid}_${index}`} task={task} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
        ))}
      </div>
    </div>
  );
};

export default AllTasks;