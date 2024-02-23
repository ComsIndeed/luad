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
        <button
          onClick={() => {
            console.log(user);
          }}
        >
          Log user details
        </button>
        <button
          onClick={() => {
            fetch(
              "https://content-docs.googleapis.com/v1/documents/1VfLIlU1eoCzqhiFoq39eG2MtDrop4799FG0986wIdmk",
              {
                Authorization: `Bearer ya29.a0AfB_byCIU_bgwa2zlsL-Xb8wtZ5OgpxVoF4RSUtS5aNDaaVzDgoOAIsZJJMD-5fpnoq_yXaj3zhS6cFLLwUT7dz74Pw2y2pySkQXNzxLQZ0YFdbsQN9x_rVDxJFc9ppEteEpIr6XZHODl6KS3HsWExN8kpJJuywiFXAnbs4aCgYKAbQSARESFQHGX2Miagbmy0uMazHgZYQyrhzCzA0174`,
                mode: "no-cors",
                method: "GET",
              }
            ).then((res) => {
              console.log(res);
            });
          }}
        >
          Log document details
        </button>
      </div>
    </>
  );
}
