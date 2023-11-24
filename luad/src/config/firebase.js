import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDo9eVV6LUMk5xYcSRqDoQJLKF-55hcp0Q",
  authDomain: "luad-db.firebaseapp.com",
  projectId: "luad-db",
  storageBucket: "luad-db.appspot.com",
  messagingSenderId: "611542890412",
  appId: "1:611542890412:web:8c9417ff0c7d89cf07ac09",
  measurementId: "G-K7X0TNWR97",
};

const app = initializeApp(firebaseConfig);

export const db = new getFirestore(app);

export const auth = new getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      sessionStorage.setItem(
        "loginSession",
        JSON.stringify({
          uid: result.user.uid,
          photoURL: result.user.photoURL,
          displayName: result.user.displayName,
          userEmail: result.user.email,
        })
      );
      console.log(sessionStorage.getItem("loginSession"));
    })
    .catch((error) => {
      console.error(error);
    });
};