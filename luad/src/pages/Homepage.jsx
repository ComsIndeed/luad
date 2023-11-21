import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { db } from "../config/firebase";
import { collection, getDocs, doc } from "firebase/firestore";

import header_placeholder from "../assets/header_placeholder.mp4"

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
          const image = undefined;
          return (
            <CardContent title={item.title} author={item.author} content={item.content} />
          );
        })}
      </div>
    </div>
  );
}

function CardContent(props) {
  return (
    <>
      <div className="content" style={{backgroundColor: "red" }} >
        <h1 className="content-title"> {props.title} </h1>
        <p className="content-author"> {props.author} </p>
        <p className="content-content"> {props.content} </p>
      </div>
    </>
  )
}

export function Homepage() {
  return (
    <>
      <Header />

      <HomepageContent />
    </>
  );
}
