
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoOgz1CXX_XrAiM5fprXd2RWYsWNpvGME",
  authDomain: "rmy-goals-6753f.firebaseapp.com",
  projectId: "rmy-goals-6753f",
  storageBucket: "rmy-goals-6753f.firebasestorage.app",
  messagingSenderId: "667301799629",
  appId: "1:667301799629:web:8e249a022f891f631ceb84"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)