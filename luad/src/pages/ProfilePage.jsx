import { signOut } from "firebase/auth";
import { auth, signInWithGoogle } from "../config/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export function ProfilePage() {
  const [user, loading, error] = useAuthState(auth);
  const signOutWithAuth = () => {
    signOut(auth);
  };

  return (
    <>
      <div className="profilePage">
        <h1>Profile Page</h1>

        <div className="controls">
          {user ? (
            <button
              onClick={() => {
                signOut(auth);
              }}
            >
              Signout
            </button>
          ) : (
            <button onClick={signInWithGoogle}>Attempt Signin</button>
          )}
        </div>

        <div className="infoDiv">
          {user ? <p> {JSON.stringify(user)} </p> : <p>User not found</p>}
        </div>
      </div>
    </>
  );
}
