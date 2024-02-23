import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFromFirestore } from "../Library/firestore";
import { Loading } from "../Reusables/Loading";
import Markdown from "markdown-to-jsx";
import "animate.css";

export function DocumentPage() {
  const [currentDocument, setCurrentDocument] = useState();
  const { id } = useParams();
  const [text, setText] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchFromFirestore("/content", id).then((fetchedDocument) => {
      setCurrentDocument(fetchedDocument);
      setText(fetchedDocument.content);
    });
  }, [id]);

  if (!currentDocument) {
    return <Loading />;
  }

  return (
    <>
      <div className="DocumentPage">
        <img
          width={768}
          height={452}
          src={currentDocument.headerImage}
          alt={`Thumbnail for ${currentDocument.title}`}
          className="animate__animated animate__fadeIn"
        />
        <h1 className="animate__animated animate__fadeIn">
          {currentDocument.title}
        </h1>
        <Markdown
          children={text}
          className="animate__animated animate__fadeIn"
        />
      </div>
    </>
  );
}
