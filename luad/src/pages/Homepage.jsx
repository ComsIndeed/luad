import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { db } from "../config/firebase";
import { collection, getDocs, doc } from "firebase/firestore";

function Header() {
  return (
    <>
      <div className="header">
        <div className="icon" />
        <h1>Luad</h1>
        <p>The collection of Potterians' talents, one click at a time</p>
        <button>Learn More</button>
      </div>
    </>
  );
}

function HomepageContent() {
  const [articlePosts, setArticlePosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Home");

  const handleCategoryChange = (event) => {
    setSelectedCategory(event);
  };

  const getArticlePosts = async () => {
    try {
      const data = await getDocs(collection(db, "posts-article"));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setArticlePosts(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getArticlePosts();
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
          return (
            <div className="content">
              <h1> {item.title} </h1>
              <blockquote> {item.author} </blockquote>
              <p> {item.content} </p>
            </div>
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
