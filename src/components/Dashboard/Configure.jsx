import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Configure = ({ user }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const uid = user.uid.toLowerCase();
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('uid', '==', uid));

        try {
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            setUserData(userDoc);
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

  return (
    <div className='configure-component'>
      {userData && (
        <div>
          <h3>User Configuration</h3>
          <p>Username: {userData.username}</p>
          <p>Name: {userData.nombre}</p>
          <p>Last Name: {userData.apellido}</p>
          <p>Phone: {userData.telefono}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
  );
}

export default Configure;