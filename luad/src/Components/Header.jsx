import React from "react";
import ThemeToggle from "../Reusables/ThemeToggle";
import LUADIcon from "../Assets/luad.webp";

function HeaderScreen_Main() {
  return (
    <>
      <div className="HeaderScreen_Main">
        <ThemeToggle />
        <img className="Header-icon" src={LUADIcon} alt="Luad Icon" />
        <h1 className="Header-title">LUAD</h1>
        <p className="Header-subtitle">
          The Potterian's Talents, one click at a time
        </p>
        <button id="LearnMoreButton">Learn more</button>
      </div>
    </>
  );
}

export function Header() {
  return (
    <>
      <div className="Header">
        <HeaderScreen_Main />
      </div>
    </>
  );
}
