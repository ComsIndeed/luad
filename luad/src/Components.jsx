import { BrowserRouter, Link } from "react-router-dom";

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
  return (
    <>
      <nav className="topNav">
        <div className="topNav-left">
          <button>Profile</button>
          <HologramLink to="/luad">Home</HologramLink>
          <HologramLink to="/luad/about">About</HologramLink>
          <HologramLink to="/luad/timeline">Timeline</HologramLink>
        </div>
        <div className="topNav-right">
          <form>
            <input type="text" placeholder=" Search" />
            <button type="submit"> {'>'} </button>
          </form>
          <button>Menu</button>
        </div>
      </nav>
    </>
  );
}
