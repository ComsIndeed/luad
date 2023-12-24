import React from "react";
import { Header } from "../Components/Header";
import { HomepageNavigation } from "../Components/HomepageNavigation";

export function Homepage() {
  return (
    <>
      <div className="Homepage">
        <Header />
        <HomepageNavigation />
      </div>
    </>
  );
}
