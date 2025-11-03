import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {

  apiKey: "AIzaSyDsdgcyS1XHrnzvjnxxqxC613_QwS7lTK8",

  authDomain: "rafael-portfolio-75b51.firebaseapp.com",

  projectId: "rafael-portfolio-75b51",

  storageBucket: "rafael-portfolio-75b51.firebasestorage.app",

  messagingSenderId: "807183499531",

  appId: "1:807183499531:web:748bb5dca71010fbefe20e"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

const db = getFirestore(app);

export { app, auth, db };
