import React from "react";
import { Header } from "../Components/Header";
import { HomepageNavigation } from "../Components/HomepageNavigation";
import { Contents } from "../Components/ContentList";
import Pagination from "../Components/Pagination";

export function Homepage({ isAdmin }) {
  return (
    <>
      <div className="Homepage">
        <Header />
        <HomepageNavigation />
        <Contents />

        {/* Pagination is yet to be done. Just rework it at this point. */}
        <Pagination />
      </div>
    </>
  );
}
