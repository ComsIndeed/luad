import { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { paths } from "./App";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import { Icon } from "@iconify/react";
import { importCollection } from "./lib/grabData";

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

export function RefreshButton(props) {
  const isVerbose = () => {
    if (props.verbose) {
      return true;
    } else {
      return false;
    }
  };
  const postID = () => {
    if (props.id) {
      return props.id;
    } else {
      return undefined;
    }
  };

  return (
    <>
      <button
        onClick={() => {
          importCollection(
            props.method,
            props.collectionID,
            postID(),
            isVerbose(),
            true
          );
        }}
        className="refreshButton"
      >
        <Icon icon="material-symbols:refresh" />
        {props.children}
      </button>
    </>
  );
}

export function Footer() {
  return (
    <>
      <footer>
        <div className="footer">
          <h1>Suggest nalang po kung anong ilalagay dito sa footer</h1>
        </div>
      </footer>
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
          <button className="toggleDarkMode" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Icon
                className="toggleDarkMode-icon"
                id="icon-darkMode"
                icon="material-symbols:dark-mode"
              />
            ) : (
              <Icon
                className="toggleDarkMode-icon"
                id="icon-lightMode"
                icon="material-symbols:light-mode"
              />
            )}
          </button>
          <search>
            <input
              type="search"
              id="searchDocs"
              name="searchDocs"
              placeholder="Search"
            />
            <button type="submit"> {">"} </button>
          </search>
          <button>Menu</button>
        </div>
      </nav>
    </>
  );
}
