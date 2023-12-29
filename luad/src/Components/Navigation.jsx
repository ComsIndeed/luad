import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { paths } from "../Configuration/paths";
import { Icon } from "@iconify/react";
import LuadWebp from "../Assets/luad.webp";
import ThemeToggle from "../Reusables/ThemeToggle";

// ! TODO: Add an "edit post" button for admins when in document pages

function Logo({ width, height }) {
  return (
    <>
      <img
        className="Header-icon"
        src={LuadWebp}
        alt="Luad Icon"
        width={width}
        height={height}
      />
      <h2 className="LuadTitle">Luad</h2>
    </>
  );
}
function Back() {
  return (
    <>
      <Link to={paths.homepage} className="BackButton">
        <Icon icon="material-symbols:arrow-back" />
      </Link>
    </>
  );
}
function LabeledBack() {
  return (
    <>
      <Link to={paths.homepage} className="BackButton">
        <Icon icon="material-symbols:arrow-back" />
        <label>Back</label>
      </Link>
    </>
  );
}

export default function Navigation({ targetDevice }) {
  if (targetDevice === "phones") {
    return (
      <>
        <div className="Navigation phone">
          <nav className="Navigation-links">
            <Back />
          </nav>
          <div className="Navigation-logo">
            <Logo height="30" width="30" />
          </div>
          <div className="Navigation-options">
            <ThemeToggle />
          </div>
        </div>
      </>
    );
  } else if (targetDevice === "tablets") {
    return (
      <>
        <div className="Navigation tablet">
          <nav className="Navigation-links">
            <LabeledBack />
          </nav>
          <div className="Navigation-logo">
            <Logo height="35" width="35" />
          </div>
          <div className="Navigation-options">
            <ThemeToggle />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="Navigation desktop">
        <nav className="Navigation-links">
          <LabeledBack />
        </nav>
        <div className="Navigation-logo">
          <Logo height="40" width="40" />
        </div>
        <div className="Navigation-options">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
