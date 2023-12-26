import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { paths } from "../Configuration/paths";
import { Icon } from "@iconify/react";

function Logo() {
  return (
    <>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/luad-db.appspot.com/o/icons%2Fluad.webp?alt=media&token=a036d4c7-36a5-473a-9562-bcd2ff93d840"
        alt="Luad Icon"
        height={30}
        width={30}
      />
      <img src={"../Assets/luad.webp"} alt="Luad Icon" height={30} width={30} />
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

interface NavigationProps {
  targetDevice: string;
}

export default function Navigation({ targetDevice }: NavigationProps) {
  if (targetDevice === "phones") {
    return (
      <>
        <div className="Navigation phone">
          <nav className="Navigation-links">
            <Back />
          </nav>
          <div className="Navigation-logo">
            <Logo />
          </div>
          <div className="Navigation-options"></div>
        </div>
      </>
    );
  } else if (targetDevice === "tablets") {
    return (
      <>
        <div className="Navigation tablet">
          <nav className="Navigation-links">Test</nav>
          <div className="Navigation-logo">
            <Logo />
          </div>
          <div className="Navigation-options"></div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="Navigation desktop">
        <nav className="Navigation-links">Test</nav>
        <div className="Navigation-logo">
          <Logo />
        </div>
        <div className="Navigation-options"></div>
      </div>
    </>
  );
}
