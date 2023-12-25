import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchFromFirestore,
  FirestoreDocument,
} from "../Library/firestoreUtils";
import { Loading } from "../Reusables/Loading";

export function DocumentPage() {
  const [currentDocument, setCurrentDocument] = useState<
    FirestoreDocument | undefined
  >(undefined);
  const { id } = useParams();

  useEffect(() => {
    fetchFromFirestore("/content", id).then(
      (
        fetchedDocument: FirestoreDocument | FirestoreDocument[] | undefined
      ) => {
        if (!fetchedDocument) {
          throw new Error("No document fetched");
        }
        // Assuming you want to handle the case where it's an array
        const singleDocument = Array.isArray(fetchedDocument)
          ? fetchedDocument[0]
          : fetchedDocument;
        setCurrentDocument(singleDocument);
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
        <p> {currentDocument.content} </p>
      </div>
    </>
  );
}
