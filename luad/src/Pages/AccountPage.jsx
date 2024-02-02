import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../Library/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Pages({ entry, userIsAdmin }) {
  if (entry.error) {
    return (
      <>
        <p>Error: {JSON.stringify(entry.error)} </p>
      </>
    );
  }
  if (entry.loading) {
    return (
      <>
        <h3>Loading profile...</h3>
      </>
    );
  }
  if (entry.user) {
    const user = entry.user;
    return (
      <>
        <img src={user.photoURL} />
        <span>
          <h2>
            {userIsAdmin ? "[Administrator]" : ""} {user.displayName}
          </h2>
        </span>
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
    </>
  );
}

export default function AccountPage({ userIsAdmin }) {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <div className="AccountPage">
        <Pages entry={{ user, loading, error }} userIsAdmin={userIsAdmin} />
      </div>
    </>
  );
}
