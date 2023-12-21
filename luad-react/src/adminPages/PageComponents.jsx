import { HologramLink } from "../Components";
import { adminConfig } from "../pages/AdminPage";

export function Layout({ children }) {
  return (
    <div className="adminPageLayout">
      <Sidebar />
      <div className="adminPage">{children}</div>
    </div>
  );
}

export function Panel({ children, classes, id, label }) {
  return (
    <>
      <div className="componentWrapper">
        <label> {label} </label>
        <div className={"panel " + classes} id={id}>
          {children}
        </div>
      </div>
    </>
  );
}

export function SubPanel({ children, classes, id, label }) {
  return (
    <>
      <div className="componentWrapper">
        <label> {label} </label>
        <div className={"subPanel " + classes} id={id}>
          {children}
        </div>
      </div>
    </>
  );
}

export function Button() {}

function Sidebar() {
  const renderAllPaths = () => {
    return Object.keys(adminConfig.paths).map((path) => {
      return (
        <HologramLink
          key={path}
          to={adminConfig.mainPath + adminConfig.paths[path]}
        >
          {" "}
          {path[0].toUpperCase() + path.slice(1)}{" "}
        </HologramLink>
      );
    });
  };

  return (
    <>
      <nav>{renderAllPaths()}</nav>
    </>
  );
}
