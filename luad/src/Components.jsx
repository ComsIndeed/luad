import { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { paths } from "./App";

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
      <Link to={props.to} className="hologramLink">
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

  return (
    <>
      <nav className="topNav">
        <div className="topNav-left">
          <Link to={paths.profilePage}>Profile</Link>
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
