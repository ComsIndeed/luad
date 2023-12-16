import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { fetchFromFirestore } from "../lib/firestoreControls";
import { paths } from "../App";
import { LazyLoadImage } from "react-lazy-load-image-component";
import LoadingScreen from "./LoadingScreen";
import Markdown from "markdown-to-jsx";

export function CardContent({ entry }) {
  const link = paths.contentPageBlank + entry.id;

  const componentClass = entry.isLargeCard ? "content large" : "content";

  return (
    <Link to={link} className={componentClass}>
      <img
        className="content-thumbnail"
        src={entry.headerImage}
        alt={entry.title}
        loading="lazy"
      />
      <h1 className="content-title">{entry.title}</h1>
      <p className="content-author">By: {entry.author}</p>
    </Link>
  );
}

export default function ContentPage() {
  const [contentData, setContentData] = useState({});
  const { id } = useParams();

  const [text, setText] = useState("");

  // On load, get all the posts and display it
  useEffect(() => {
    fetchFromFirestore("/content", id).then((returned) => {
      setContentData(returned);
      setText(returned.content);
    });
  }, []);

  return (
    <>
      <div className="contentPage">
        {contentData ? "" : <LoadingScreen />}
        <h1 className="contentPage-title"> {contentData.title} </h1>
        <p className="contentPage-author">
          {" "}
          {contentData.author ? "By:" : ""} {contentData.author}{" "}
        </p>
        <LazyLoadImage
          className="contentPage-thumbnail"
          src={contentData.headerImage}
        />
        <Markdown children={text} className="contentPage-content" />
      </div>
    </>
  );
}
