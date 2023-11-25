import { useEffect, useState } from "react";

import { CardContent } from "./ContentPage";

import header_placeholder from "../assets/header_placeholder.mp4";
import { importCollection } from "../lib/grabData";

function Header() {
  return (
    <>
      <div className="header">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="header-video"
          src={header_placeholder}
        />
        <div className="icon" />
        <h1 className="homepage-headerTitle">Luad</h1>
        <p className="homepage-subtitle">
          The collection of Potterians' talents, one click at a time
        </p>
        <button id="homepage-learnMoreButton">Learn More</button>
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
    importCollection(setArticlePosts, "posts-article");
  }, []);

  const renderContent = () => {
    switch (selectedCategory) {
      case "Home":
        return (
          <div className="contentList">
            {articlePosts.map((item) => {
              return <CardContent key={item.id} entry={item} />;
            })}
          </div>
        );

      case "Articles":
        // Render articles content
        // You can add a separate component for articles
        return <div className="contentList">Articles go here</div>;

      case "Editorials":
        // Render editorials content
        // You can add a separate component for editorials
        return <div className="contentList">Editorials content</div>;

      case "Sports":
        // Render sports content
        // You can add a separate component for sports
        return <div className="contentList">Sports content</div>;

      case "Events":
        // Render events content
        // You can add a separate component for events
        return <div className="contentList">Events content</div>;

      case "Others":
        // Render others content
        // You can add a separate component for others
        return <div className="contentList">Others content</div>;

      default:
        return null;
    }
  };

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

      {renderContent()}
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
