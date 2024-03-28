import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFromFirestore } from "../Library/firestore";
import { Loading } from "../Reusables/Loading";
import Markdown, { compiler } from "markdown-to-jsx";
import "animate.css";

export function DocumentPage() {
  const [currentDocument, setCurrentDocument] = useState();
  const { id } = useParams();
  const [text, setText] = useState("");
  const [currentHeaderImage, setCurrentHeaderImage] = useState(() => {
    if (!currentDocument?.head?.headerImage?.tiny) {
      return currentDocument?.head?.headerImage?.large;
    }
  });

  useEffect(() => {
    if (currentDocument?.head?.headerImage?.tiny) {
      setCurrentHeaderImage(currentDocument?.head?.headerImage?.tiny);
      const image = new Image();
      image.src = currentDocument?.head?.headerImage?.large;
      image.onload = () => {
        setCurrentHeaderImage(currentDocument?.head?.headerImage?.large);
      };
    } else {
      setCurrentHeaderImage(currentDocument?.head?.headerImage?.large);
    }
  }, [currentDocument]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log({ text });
  }, [text]);

  useEffect(() => {
    fetchFromFirestore("documents", id, true).then((fetchedDocument) => {
      setCurrentDocument(fetchedDocument);
      setText(fetchedDocument.body);
    });
  }, [id]);

  if (!currentDocument) {
    return <Loading />;
  }

  return (
    <>
      <div className="DocumentPage">
        {currentDocument.head.headerImage.large && (
          <img
            width={768}
            height={452}
            src={currentHeaderImage}
            alt={`Thumbnail for ${currentDocument.head.title}`}
            className="animate__animated animate__fadeIn"
          />
        )}
        <h1 className="animate__animated animate__fadeIn">
          {currentDocument.head.title}
        </h1>

        <Markdown
          children={text}
          className="animate__animated animate__fadeIn"
          // options={{
          //   overrides: {
          //     p: {
          //       component: NewlineToBreakComponent,
          //     },
          //   },
          // }}
        />
      </div>
    </>
  );
}

// Custom component to convert \n to <br />
const NewlineToBreakComponent = ({ children }) => {
  // Extract text content from children
  const textContent = React.Children.toArray(children).join("");

  return textContent.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < textContent.length - 1 && <br />}
    </React.Fragment>
  ));
};
