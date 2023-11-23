import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { useState, useEffect } from "react";

const signInWithGoogleRedirect = async () => {
  const result = await signInWithRedirect(auth, provider);
};

const printInfo = () => {
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        const currentUser = result.user;
        const displayName = currentUser.displayName;
        const photoURL = currentUser.photoURL;
        const isLoggedIn = true;
        console.log({ displayName, photoURL, isLoggedIn });
      } else {
        console.log("User is not signed in");
      }
    })
    .catch((error) => {
      console.error("Failed to get redirect result:", error);
    });
};

export function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result.user) {
          setCurrentUser(result.user);
          setIsLoggedIn(true);
        } else {
          console.log("User is not signed in");
        }
      })
      .catch((error) => {
        console.error("Failed to get redirect result:", error);
      });
  }, []);

  return (
    <>
      <p>Profile Page</p>
      {currentUser && <img src={currentUser.photoURL} alt={currentUser.displayName} />}
      <p>isLoggedIn: {isLoggedIn.toString()}</p>
      <button onClick={signInWithGoogleRedirect}>Attempt Signin</button>
      <button onClick={printInfo}>Print info</button>
    </>
  );
}
