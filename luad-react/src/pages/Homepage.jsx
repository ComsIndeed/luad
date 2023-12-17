import { useEffect, useRef, useState } from "react";
import { CardContent } from "./ContentPage";
import headerImage from "../assets/header.webp";
import LuadWebp from "../assets/luad.webp";
import { ContentPanel } from "../Components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fetchFromFirestore } from "../lib/firestoreControls";
import LoadingScreen from "./LoadingScreen";
import { LearnMoreScreen } from "./LearnMoreScreen";

function Header({ setShowLearnMoreScreen, showLearnMoreScreen }) {
  const componentClass = showLearnMoreScreen
    ? "header showLearnMoreScreen"
    : "header";

  return (
    <>
      <div className={componentClass}>
        <LazyLoadImage className="header-video" src={headerImage} />
        <LazyLoadImage
          className="icon"
          src={LuadWebp}
          alt="Luad Icon"
          width={150}
          height={150}
        />
        <h1 className="homepage-headerTitle">Luad</h1>
        <p className="homepage-subtitle">
          The collection of Potterians' talents, one click at a time
        </p>

        <LearnMoreScreen />

        <button
          onClick={() => {
            setShowLearnMoreScreen(!showLearnMoreScreen);
          }}
          id="homepage-learnMoreButton"
        >
          Learn More
        </button>
      </div>
    </>
  );
}

function ContentList({ content }) {
  const renderContent = () =>
    content.map((doc) => {
      return <CardContent entry={doc} key={doc.id} />;
    });

  return <>{renderContent()}</>;
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
      <div className="contents">
        <ContentPanel method={setContent} />
        {content.length != 0 ? (
          <div className="contentList">
            <ContentList content={content} />
          </div>
        ) : (
          <LoadingScreen />
        )}
      </div>
    </>
  );
}

export function Homepage() {
  const [showLearnMoreScreen, setShowLearnMoreScreen] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (showLearnMoreScreen) {
      scrollToTop();
    }
  }, [showLearnMoreScreen]);

  return (
    <>
      <Header
        setShowLearnMoreScreen={setShowLearnMoreScreen}
        showLearnMoreScreen={showLearnMoreScreen}
      />

      <HomepageContent />
    </>
  );
}
