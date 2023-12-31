import { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { paths } from "./App";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import { Icon } from "@iconify/react";
import { fetchFromFirestore } from "./lib/firestoreControls";

export function HologramButton({ children, classes, onClick }) {
  const outputClass = "hologramButton " + classes;

  return (
    <>
      <button onClick={onClick} className={outputClass}>
        {children}
      </button>
    </>
  );
}
export function HologramLink(props) {
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

export function RefreshButton({ id, verbose, children, method }) {
  const isVerbose = () => {
    if (verbose) {
      return true;
    } else {
      return false;
    }
  };
  const postID = () => {
    if (id) {
      return id;
    } else {
      return undefined;
    }
  };

  return (
    <>
      <button
        onClick={() => {
          fetchFromFirestore("/content", postID(), true, isVerbose()).then(
            (returned) => {
              method(returned);
            }
          );
        }}
        className="refreshButton"
      >
        <Icon icon="material-symbols:refresh" height={15} />
        {children}
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

export function NavigationBar({ userIsAdmin, toggleDarkMode, isDarkMode }) {
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
          {userIsAdmin ? (
            ""
          ) : (
            <HologramLink to={paths.apply}>Apply for LUAD</HologramLink>
          )}
          {userIsAdmin ? (
            <HologramLink to={paths.adminPanel}>Admin Panel</HologramLink>
          ) : (
            ""
          )}
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
        </div>
      </nav>
    </>
  );
}

export function SearchBar() {
  return (
    <>
      <div className="search form">
        <Icon icon="material-symbols:search" height={25} />
        <input
          type="search"
          id="searchDocs"
          name="searchDocs"
          placeholder="Search"
        />
      </div>
    </>
  );
}

export function CategorySelection({ entry }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const isSelected = (target1, target2) => {
    return target1 === target2 ? "selected" : "";
  };

  return (
    <>
      {entry.map((category) => {
        return (
          <HologramButton
            onClick={() => {
              setSelectedCategory(category);
            }}
            classes={isSelected(category, selectedCategory)}
          >
            {" "}
            {category}{" "}
          </HologramButton>
        );
      })}
    </>
  );
}
