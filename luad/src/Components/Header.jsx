import React, { useEffect, useState } from "react";
import ThemeToggle from "../Reusables/ThemeToggle";
import LUADIcon from "../Assets/luad.webp";
import "animate.css";

function HeaderScreen_Main({ setScreenState, screenState, expand, setExpand }) {
  useEffect(() => {
    if (expand === "expand") {
      setTimeout(() => {}, 1200);
    }
  }, []);

  return (
    <>
      <div className={`HeaderScreen_Main ${expand} `}>
        <ThemeToggle />
        <img className="Header-icon " src={LUADIcon} alt="Luad Icon" />
        {screenState === "default" && (
          <>
            <h1 className="Header-title Header-title-luad animate__animated animate__fadeIn">
              LUAD
            </h1>
          </>
        )}
        {screenState === "info" && (
          <>
            <h1 className="Header-title animate__animated animate__fadeIn">
              Welcome to <span className="Header-title-luad">LUAD</span>
            </h1>
          </>
        )}
        <p className="Header-subtitle">
          The Potterian's Talents, one click at a time <br /> <br />
          {screenState === "info" && "THIS PAGE IS UNDER DEVELOPMENT"}
        </p>
        <button
          id="LearnMoreButton"
          onClick={() => {
            setExpand(() => {
              if (expand === "expand") {
                setScreenState("default");
                return "not";
              } else {
                setScreenState("info");
                return "expand";
              }
            });
          }}
        >
          Learn more
        </button>
      </div>
    </>
  );
}

function HeaderScreen_Info() {
  return (
    <>
      <div className="HeaderScreen_Info">
        <div className="options"></div>
      </div>
    </>
  );
}

export function Header() {
  const [screenState, setScreenState] = useState("default");
  const [expand, setExpand] = useState("not");

  return (
    <>
      <div
        className={"Header animate__animated animate__fadeIn " + screenState}
      >
        <HeaderScreen_Main
          screenState={screenState}
          setScreenState={setScreenState}
          expand={expand}
          setExpand={setExpand}
        />
      </div>
    </>
  );
}
