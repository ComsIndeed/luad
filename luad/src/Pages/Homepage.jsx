import React, { useEffect, useState } from "react";
import { Header } from "../Components/Header";
import { HomepageNavigation } from "../Components/HomepageNavigation";
import { ContentList } from "../Components/ContentList";

// TODO
// TODO 1. Implement search queries
// TODO 2. Vary the card displays on homepage
// TODO 3. Lazyload components and scripts
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO
// TODO

export function Homepage({ isAdmin }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchBarValue, setSearchBarValue] = useState("");

  return (
    <>
      <div className="Homepage">
        <Header />
        <HomepageNavigation
          isAdmin={isAdmin}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          setSearchBarValue={setSearchBarValue}
          searchBarValue={searchBarValue}
        />
        <ContentList
          selectedCategory={selectedCategory}
          searchBarValue={searchBarValue}
        />
      </div>
    </>
  );
}
