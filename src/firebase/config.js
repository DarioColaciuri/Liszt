import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAkoTnAY0DMF35LdgK9SDY9YX9CO0ZmtY",
  authDomain: "liszt-b1746.firebaseapp.com",
  projectId: "liszt-b1746",
  storageBucket: "liszt-b1746.appspot.com",
  messagingSenderId: "1032384141966",
  appId: "1:1032384141966:web:fbf0fcbc1291ae40c607df"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };