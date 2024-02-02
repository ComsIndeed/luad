import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// luad-db
// const firebaseConfig = {
//   apiKey: "AIzaSyDo9eVV6LUMk5xYcSRqDoQJLKF-55hcp0Q",
//   authDomain: "luad-db.firebaseapp.com",
//   projectId: "luad-db",
//   storageBucket: "luad-db.appspot.com",
//   messagingSenderId: "611542890412",
//   appId: "1:611542890412:web:8c9417ff0c7d89cf07ac09",
//   measurementId: "G-K7X0TNWR97",
// };

// luad-main
const firebaseConfig = {
  apiKey: "AIzaSyDo9eVV6LUMk5xYcSRqDoQJLKF-55hcp0Q",
  authDomain: "luad-db.firebaseapp.com",
  databaseURL:
    "https://luad-db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "luad-db",
  storageBucket: "luad-db.appspot.com",
  messagingSenderId: "611542890412",
  appId: "1:611542890412:web:b4e650268d151f9e07ac09",
  measurementId: "G-Q31QSK8WGP",
};

const app = initializeApp(firebaseConfig);

// Database
export const db = new getFirestore(app);

// Authentication
export const auth = new getAuth(app);
export const provider = new GoogleAuthProvider();

// Storage
export const storage = getStorage(app);
