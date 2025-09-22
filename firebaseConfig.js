
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPZbRgEoPZPjP2HgkVklxAP5ffdCyiilU",
  authDomain: "studyplay-d99fc.firebaseapp.com",
  projectId: "studyplay-d99fc",
  storageBucket: "studyplay-d99fc.firebasestorage.app",
  messagingSenderId: "785589784316",
  appId: "1:785589784316:web:f6443363e074d00c539179"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)