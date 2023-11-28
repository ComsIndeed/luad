import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { importCollection } from "../lib/grabData";
import { paths } from "../App";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ref } from "firebase/storage";

import Markdown from "markdown-to-jsx";

export function CardContent(props) {
  const link = paths.contentPageBlank + props.entry.id;

  return (
    <>
      <Link to={link} className="content">
        <img
          className="content-thumbnail"
          src={props.entry.thumbnail}
          // effect="blur"
          loading="lazy"
        />
        <h1 className="content-title">{props.entry.title}</h1>
        <p className="content-author">By: {props.entry.author}</p>
        {/* <p className="content-content">{props.entry.content}</p> */}
      </Link>
    </>
  );
}

export default function ContentPage() {
  const [contentData, setContentData] = useState({});
  const { id } = useParams();

  // On load, get all the posts and display it
  useEffect(() => {
    importCollection(
      (fetchedData) => {
        setContentData(fetchedData);
      },
      "posts-article",
      id
    );
  }, []);

  return (
    <>
      <div className="contentPage">
        <h1 className="contentPage-title"> {contentData.title} </h1>
        <p className="contentPage-author">By: {contentData.author} </p>
        <LazyLoadImage
          className="contentPage-thumbnail"
          src={contentData.thumbnail}
        />
        <p className="contentPage-content"> {contentData.content} </p>
      </div>
    </>
  );
}
