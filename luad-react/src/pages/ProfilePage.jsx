import { signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { paths } from "../App";

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
        <p> {user.email} </p>
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
        Sign-in with popup
      </button>
      <button
        onClick={() => {
          window.open(
            window.location.href.split("/")[0].toString() +
              "/signInWithRedirect",
            "_blank"
          );
        }}
      >
        Sign-in with redirect
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
