import React from "react";
import { Link } from "react-router-dom";

export function NavigationLink({ children, to }) {
  return (
    <>
      <Link className="NavigationLink" to={to}>
        {children}
      </Link>
    </>
  );
}
