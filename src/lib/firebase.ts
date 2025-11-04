import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyDsdgcyS1XHrnzvjnxxqxC613_QwS7lTK8",

  authDomain: "rafael-portfolio-75b51.firebaseapp.com",

  projectId: "rafael-portfolio-75b51",

  storageBucket: "rafael-portfolio-75b51.firebasestorage.app",

  messagingSenderId: "807183499531",

  appId: "1:807183499531:web:748bb5dca71010fbefe20e"

};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
