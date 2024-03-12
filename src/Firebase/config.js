// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9NdEnDtEwoq9ZL8xJ-190lsmIafntKPg",
  authDomain: "expensetracker-7b8cf.firebaseapp.com",
  projectId: "expensetracker-7b8cf",
  storageBucket: "expensetracker-7b8cf.appspot.com",
  messagingSenderId: "228804401939",
  appId: "1:228804401939:web:713daaa34fea28b45d98e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export default db;