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
          <Link to="/luad/profile">Profile</Link>
          <HologramLink to="/luad">Home</HologramLink>
          <HologramLink to="/luad/about">About</HologramLink>
          <HologramLink to="/luad/timeline">Timeline</HologramLink>
          <HologramLink to="/luad/boardmembers">Board Members</HologramLink>
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
