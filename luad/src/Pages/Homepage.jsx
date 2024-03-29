import React, { useEffect, useState } from "react";
import { Header } from "../Components/Header";
import { HomepageNavigation } from "../Components/HomepageNavigation";
import { ContentList } from "../Components/ContentList";

export function Homepage({ isAdmin }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <>
      <div className="Homepage">
        <Header />
        <HomepageNavigation
          isAdmin={isAdmin}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <ContentList selectedCategory={selectedCategory} />
      </div>
    </>
  );
}
