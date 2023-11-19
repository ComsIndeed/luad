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
    <>
      <div className="content">
        {articlePosts.map((item) => {
          return (
            <div className="articlePost">
              <h1> {item.title} </h1>
              <blockquote> {item.author} </blockquote>
              <p> {item.content} </p>
            </div>
          );
        })}
      </div>
    </>
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
