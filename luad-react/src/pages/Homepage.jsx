import { useEffect, useState } from "react";

import { CardContent } from "./ContentPage";

import headerImage from "../assets/header.jpg";
import { RefreshButton } from "../Components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fetchFromFirestore } from "../lib/firestoreControls";
import { Helmet } from "react-helmet-async";

function Header() {
  return (
    <>
      <div className="header">
        <LazyLoadImage className="header-video" src={headerImage} />
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
  const [content, setContent] = useState([]);
  useEffect(() => {
    fetchFromFirestore("/content").then((returned) => {
      setContent(returned);
    });
  }, []);

  return (
    <>
      <RefreshButton />
      <div className="contents">
        <div className="contentList">
          {content.map((doc) => {
            return (
              <>
                <CardContent entry={doc} key={doc.id} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function Homepage() {
  return (
    <>
      <Helmet>
        <title>Homepage | Luad Publications</title>
        <meta property="og:title" content="Welcome to Luad Publications!" />
        <meta property="og:site_name" content="Luad Publications" />
        <meta property="og:url" content="luad.web.app" />
        <meta
          property="og:description"
          content="The collection of Potterians' talents, one click at a time"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="gdfgd" />
      </Helmet>

      <Header />

      <HomepageContent />
    </>
  );
}
