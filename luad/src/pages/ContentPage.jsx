import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { importCollection } from "../lib/grabData";
import { paths } from "../App";

import { ref } from "firebase/storage";

import Markdown from "markdown-to-jsx";

export function CardContent(props) {
  const link = paths.contentPageBlank + props.entry.id;

  return (
    <>
      <Link to={link} className="content">
        <img className="content-thumbnail" src={props.entry.thumbnail} />
        {/* Help with making it so that the image is the same size as the parent */}
        <h1 className="content-title">{props.entry.title}</h1>
        <p className="content-author">{props.entry.author}</p>
        <p className="content-content">{props.entry.content}</p>
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
      <h1>Content Page ID - {id}</h1> <br />
      <h1> {contentData.title} </h1>
      <p>By: {contentData.author} </p>
      <p> {contentData.content} </p>
      <Link to={paths.homepage}>Home</Link>
    </>
  );
}
