import { useEffect, useState } from "react";

import { CardContent } from "./ContentPage";

import header_placeholder from "../assets/header_placeholder.mp4"
import { importCollection } from "../lib/grabData";

function Header() {
  return (
    <>
      <div className="header">
        <video autoPlay loop muted playsInline className="header-video" src={header_placeholder} />
        <div className="icon" />
        <h1>Luad</h1>
        <p>The collection of Potterians' talents, one click at a time</p>
        <button>Learn More</button>
      </div>
    </>
  );
}

function HomepageContent() {
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const handleCategoryChange = (event) => {
    setSelectedCategory(event);
  };

  const [articlePosts, setArticlePosts] = useState([]);
  useEffect(() => {
    importCollection(setArticlePosts, "posts-article")
  }, []);

  return (
    <div className="contents">
      <div className="categoryPanel">
        <button
          onClick={() => handleCategoryChange("Home")}
          className={selectedCategory === "Home" ? "isSelected" : ""}
        >
          Home
        </button>

        <button
          onClick={() => handleCategoryChange("Articles")}
          className={selectedCategory === "Articles" ? "isSelected" : ""}
        >
          Articles
        </button>

        <button
          onClick={() => handleCategoryChange("Editorials")}
          className={selectedCategory === "Editorials" ? "isSelected" : ""}
        >
          Editorials
        </button>

        <button
          onClick={() => handleCategoryChange("Sports")}
          className={selectedCategory === "Sports" ? "isSelected" : ""}
        >
          Sports
        </button>

        <button
          onClick={() => handleCategoryChange("Events")}
          className={selectedCategory === "Events" ? "isSelected" : ""}
        >
          Events
        </button>

        <button
          onClick={() => handleCategoryChange("Others")}
          className={selectedCategory === "Others" ? "isSelected" : ""}
        >
          Others
        </button>
      </div>

      <div className="contentList">
        {articlePosts.map((item) => {
          const image = undefined;
          return (
            <CardContent entry={item} />
          );
        })}
      </div>
    </div>
  );
}

export function Homepage() {
  return (
    <>
      <Header />

      <HomepageContent />
    </>
  );
}
