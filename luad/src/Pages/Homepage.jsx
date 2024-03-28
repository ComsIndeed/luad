import React, { useState } from "react";
import { Header } from "../Components/Header";
import { HomepageNavigation } from "../Components/HomepageNavigation";
import { Contents } from "../Components/ContentList";

export function Homepage({ isAdmin }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <>
      <div className="Homepage">
        <Header />
        <HomepageNavigation
          isAdmin={isAdmin}
          setSelectedCategory={selectedCategory}
          selectedCategory={selectedCategory}
        />
        <Contents selectedCategory={selectedCategory} />
      </div>
    </>
  );
}
