import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchFromFirestore,
  FirestoreDocument,
} from "../Library/firestoreUtils";
import { Loading } from "../Reusables/Loading";
import Markdown from "markdown-to-jsx";

export function DocumentPage() {
  const [currentDocument, setCurrentDocument] = useState<
    FirestoreDocument | undefined
  >(undefined);
  const { id } = useParams();
  const [text, setText] = useState<string>("");

  useEffect(() => {
    fetchFromFirestore("/content", id).then(
      (
        fetchedDocument: FirestoreDocument | FirestoreDocument[] | undefined
      ) => {
        if (!fetchedDocument || Array.isArray(fetchedDocument)) {
          console.error(fetchedDocument);
          throw new Error(
            "Either there is no document or an array of document got fetched"
          );
        }
        setCurrentDocument(fetchedDocument);
        if (typeof fetchedDocument.content == "string") {
          setText(fetchedDocument.content);
        }
      }
    );
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
        />
        <h1>{currentDocument.title}</h1>
        <Markdown children={text} />
      </div>
    </>
  );
}
