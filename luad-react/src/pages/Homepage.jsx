import { useEffect, useRef, useState } from "react";
import { CardContent } from "./ContentPage";
import headerImage from "../assets/header.webp";
import LuadWebp from "../assets/luad.webp";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fetchFromFirestore } from "../lib/firestoreControls";
import LoadingScreen from "./LoadingScreen";
import { LearnMoreScreen } from "./LearnMoreScreen";
import { CategorySelection, RefreshButton, SearchBar } from "../Components";
import { Icon } from "@iconify/react";

function Header({ setShowLearnMoreScreen, showLearnMoreScreen }) {
  const componentClass = showLearnMoreScreen
    ? "header showLearnMoreScreen"
    : "header";

  return (
    <>
      <div className={componentClass}>
        {/* <LazyLoadImage className="header-video" src={headerImage} /> */}
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

function ContentPanel({ method, toggleDarkMode, isDarkMode }) {
  const cagetories = ["All", "Articles", "Editorials", "Literature"];

  return (
    <>
      <div className="contentPanel">
        <CategorySelection entry={cagetories} />
        <SearchBar />
        <RefreshButton method={method} />
        <button className="toggleDarkMode" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Icon
              className="toggleDarkMode-icon"
              id="icon-darkMode"
              icon="material-symbols:dark-mode"
            />
          ) : (
            <Icon
              className="toggleDarkMode-icon"
              id="icon-lightMode"
              icon="material-symbols:light-mode"
            />
          )}
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

function HomepageContent({ isDarkMode, toggleDarkMode }) {
  const [content, setContent] = useState([]);
  useEffect(() => {
    fetchFromFirestore("/content").then((returned) => {
      setContent(returned);
    });
  }, []);

  return (
    <>
      <div className="contents">
        <ContentPanel
          method={setContent}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
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

function HomepageNavigation() {
  return (
    <>
      <nav>test</nav>
    </>
  );
}

export function Homepage({ toggleDarkMode, isDarkMode }) {
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
      <div className="homepage">
        <Header
          setShowLearnMoreScreen={setShowLearnMoreScreen}
          showLearnMoreScreen={showLearnMoreScreen}
        />

        <HomepageContent
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
      </div>
    </>
  );
}
