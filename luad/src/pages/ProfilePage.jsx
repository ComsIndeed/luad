import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, signInWithGoogle } from "../config/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function Pages(props) {
  if (props.entry.error) {
    return (
      <>
        <p>Error: {JSON.stringify(props.entry.error)} </p>
      </>
    );
  }
  if (props.entry.loading) {
    return (
      <>
        <h3>Loading profile...</h3>
      </>
    );
  }
  if (props.entry.user) {
    const user = props.entry.user;
    return (
      <>
        <img src={user.photoURL} />
        <h2> {user.displayName} </h2>
        <button
          onClick={() => {
            signOut(auth);
          }}
        >
          Signout
        </button>
      </>
    );
  }
  return (
    <>
      <button
        onClick={() => {
          signInWithPopup(auth, provider);
        }}
      >
        Login
      </button>
    </>
  );
}

export function ProfilePage() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <div className="profilePage">
        <Pages entry={{ user, loading, error }} />
      </div>
    </>
  );
}
