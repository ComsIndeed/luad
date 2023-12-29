import React from "react";
import { Header } from "../Components/Header";
import { HomepageNavigation } from "../Components/HomepageNavigation";
import { Contents } from "../Components/ContentList";

export function Homepage() {
  return (
    <>
      <div className="Homepage">
        <Header />
        <HomepageNavigation />
        <Contents />
      </div>
    </>
  );
}
