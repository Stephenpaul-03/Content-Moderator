import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDMYEjvpeTRSqb0pBjtfpzCJGvtJDb4mhI",
  authDomain: "content-moderator-16a65.firebaseapp.com",
  databaseURL: "https://content-moderator-16a65-default-rtdb.firebaseio.com",
  projectId: "content-moderator-16a65",
  storageBucket: "content-moderator-16a65.firebasestorage.app",
  messagingSenderId: "303082100074",
  appId: "1:303082100074:web:e8ea7176b7915373ad0113",
  measurementId: "G-9Y9H21V9TJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
