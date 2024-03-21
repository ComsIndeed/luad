import React, { useEffect, useState } from "react";
import ThemeToggle from "../Reusables/ThemeToggle";
import LUADIcon from "../Assets/luad.webp";
import "animate.css";

function HeaderScreen_Main({ setScreenState, screenState }) {
  return (
    <>
      <div className="HeaderScreen_Main ">
        <ThemeToggle />
        <img className="Header-icon" src={LUADIcon} alt="Luad Icon" />
        <h1 className="Header-title">LUAD</h1>
        <p className="Header-subtitle">
          The Potterian's Talents, one click at a time
        </p>
        <button
          id="LearnMoreButton"
          onClick={() => {
            setScreenState("info");
          }}
        >
          Learn more
        </button>
      </div>
    </>
  );
}

function HeaderScreen_Info() {
  const [titleState, setTitleState] = useState("center");

  const [visibleCards, setVisibleCards] = useState([]);

  const ItemCards = [
    <button className="ItemCard">
      <h1 className="ItemCard-header"> TEST_HEADER 1 </h1>
    </button>,
    <button className="ItemCard">
      <h1 className="ItemCard-header"> TEST_HEADER 2 </h1>
    </button>,
    <button className="ItemCard">
      <h1 className="ItemCard-header"> TEST_HEADER 3 </h1>
    </button>,
    <button className="ItemCard">
      <h1 className="ItemCard-header"> TEST_HEADER 4 </h1>
    </button>,
  ];

  useEffect(() => {
    setTimeout(() => {
      setTitleState("top");
    });
  }, []);

  return (
    <>
      <div className="HeaderScreen_Info">
        <h1
          className={
            "animate__animated animate__fadeIn Header-title " + titleState
          }
        >
          Welcome to <span className="Header-title-LUAD">LUAD</span>
        </h1>
        <div className="options">
          {ItemCards.map((item) => {
            setTimeout(() => {
              return item;
            }, 500);
          })}
        </div>
      </div>
    </>
  );
}

export function Header() {
  const [screenState, setScreenState] = useState("default");

  return (
    <>
      <div className={"Header " + screenState}>
        {screenState === "default" && (
          <HeaderScreen_Main
            screenState={screenState}
            setScreenState={setScreenState}
          />
        )}

        {screenState === "info" && <HeaderScreen_Info />}
      </div>
    </>
  );
}
