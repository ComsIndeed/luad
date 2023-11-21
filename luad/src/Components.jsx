
import { BrowserRouter, Link } from "react-router-dom";

function HologramButton(props) {
  return (
    <>
      <button className="hologramButton">
        {props.children}
      </button>
    </>
  )
}
function HologramLink(props) {
  return (
    <>
      <Link to={props.to} className="hologramLink"> {props.children} </Link>
    </>
  )
}

export function NavigationBar() {
  return (
    <>
      <nav className="topNav">
        <HologramLink to="/luad">Home</HologramLink>
        <HologramLink to="/luad/about">About</HologramLink>
      </nav>
    </>
  );
}
