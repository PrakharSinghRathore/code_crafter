import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYD3Dw64rcjgdrSB9HR0JiNW8qp4ne3h0",
  authDomain: "project1-e9627.firebaseapp.com",
  projectId: "project1-e9627",
  storageBucket: "project1-e9627.appspot.com",
  messagingSenderId: "528098334551",
  appId: "1:528098334551:web:fb94a6d28b474b39329012"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app;