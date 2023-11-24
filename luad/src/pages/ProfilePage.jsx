import { signOut } from "firebase/auth";
import { signInWithGoogle } from "../config/firebase";
import { useState, useEffect } from "react";

export function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <>
      <div className="profilePage">
        <h1>Profile Page</h1>
        <div className="controls">
          {currentUser && (
            <img src={currentUser.photoURL} alt={currentUser.displayName} />
          )}

          <button onClick={signInWithGoogle}>Attempt Signin</button>
          <button
            onClick={() => {
              signOut();
              sessionStorage.removeItem("loginSession");
            }}
          >
            Attempt Signout
          </button>

          <button>Print info</button>
        </div>
        <div className="infoDiv">
          <h2>Info goes here</h2>
          <p>Display Name: {sessionStorage.getItem("loginSession")}</p>
          <p>Email: {sessionStorage.getItem("userEmail")} </p>
        </div>
      </div>
    </>
  );
}
