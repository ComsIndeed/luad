import { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { paths } from "./App";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import { Icon } from "@iconify/react";

function HologramButton(props) {
  return (
    <>
      <button className="hologramButton">{props.children}</button>
    </>
  );
}
function HologramLink(props) {
  return (
    <>
      <Link
        to={props.to}
        className={`hologramLink${
          props.appendClass ? ` ${props.appendClass}` : ""
        }`}
      >
        {" "}
        {props.children}{" "}
      </Link>
    </>
  );
}

export function NavigationBar() {
  const [isDarkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);

    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.remove("darkmode");
    } else {
      htmlElement.classList.add("darkmode");
    }
  };

  const [user, loading, error] = useAuthState(auth);
  return (
    <>
      <nav className="topNav">
        <div className="topNav-left">
          <HologramLink to={paths.profilePage} appendClass="accountIconLink">
            {user ? (
              <img src={user.photoURL} className="accountIcon" />
            ) : (
              <Icon
                className="accountIcon"
                icon="material-symbols:account-circle"
              />
            )}
          </HologramLink>
          <HologramLink to={paths.homepage}>Home</HologramLink>
          <HologramLink to={paths.aboutPage}>About</HologramLink>
          <HologramLink to={paths.timelinePage}>Timeline</HologramLink>
          <HologramLink to={paths.boardMembersPage}>Board Members</HologramLink>
        </div>
        <div className="topNav-right">
          <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
          <form>
            <input type="text" placeholder=" Search" />
            <button type="submit"> {">"} </button>
          </form>
          <button>Menu</button>
        </div>
      </nav>
    </>
  );
}
