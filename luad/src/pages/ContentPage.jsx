import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { importCollection } from "../lib/grabData";

export function CardContent(props) {
  const link = "/luad/post/" + props.entry.id;

  console.log(props.entry);

  return (
    <>
      <Link to={link} className="contentLink">
        <p>Document ID: {props.entry.id}</p>
        {/* CODE FOR IMAGES HERE */}
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
  useEffect(() => {
    importCollection((fetchedData) => {
      setContentData(fetchedData);
    }, "posts-article", id);
  }, []);

  const TEMP = JSON.stringify(contentData);

  return (
    <>
      <h1>Content Page ID - {id}</h1>
      <br />
      <h2>Page Data: <pre>{TEMP.split(',').join('\n')}</pre></h2>
      <Link to="/luad">Home</Link>
    </>
  );
}