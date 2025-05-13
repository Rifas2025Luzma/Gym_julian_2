import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwanfdxAJqUhV3APB8W8pCQeQ2qysPKog",
  authDomain: "gym-julian.firebaseapp.com",
  databaseURL: "https://gym-julian-default-rtdb.firebaseio.com",
  projectId: "gym-julian",
  storageBucket: "gym-julian.appspot.com",
  messagingSenderId: "1040456085176",
  appId: "1:1040456085176:web:bb0c356379cd214ce78e4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Enable offline persistence
import { enableIndexedDbPersistence } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firestore = getFirestore(app);
enableIndexedDbPersistence(firestore).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser doesn\'t support offline persistence');
  }
});