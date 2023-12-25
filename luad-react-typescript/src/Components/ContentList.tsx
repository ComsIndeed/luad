import React, { Suspense, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  fetchFromFirestore,
  FirestoreDocument,
} from "../Library/firestoreUtils";
import { Loading } from "../Reusables/Loading";
import { Link } from "react-router-dom";
import { paths } from "../Configuration/paths";

interface SuspendedDisplayProps {
  children: ReactNode;
}

function SuspendedDisplay({ children }: SuspendedDisplayProps) {
  return (
    <>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </>
  );
}

interface ContentCardProps {
  entry: FirestoreDocument;
}

function ContentCard({ entry }: ContentCardProps) {
  return (
    <>
      <Link to={paths.posts + entry.id} className="ContentCard">
        <img
          className="ContentCard-thumbnail"
          height={250}
          src={entry.headerImage}
          alt={`Thumbnail for the article: "${entry.title}"`}
        />
        <h2 className="ContentCard-title"> {entry.title} </h2>
      </Link>
    </>
  );
}

interface ContentGridProps {
  entries: FirestoreDocument[];
}

function ContentGrid({ entries }: ContentGridProps) {
  return (
    <>
      <div className="ContentGrid">
        {entries.map((fetchedDocument) => {
          return (
            <ContentCard key={fetchedDocument.id} entry={fetchedDocument} />
          );
        })}
      </div>
    </>
  );
}

interface ContentListProps {
  entries: FirestoreDocument[];
}

function ContentList({ entries }: ContentListProps) {
  console.log(entries);
  return (
    <>
      <div className="ContentList"></div>
    </>
  );
}

export function Contents() {
  const [collectionList, setCollectionList] = useState<FirestoreDocument[]>([]);
  const [displayType, setDisplayType] = useState("grid");

  useEffect(() => {
    fetchFromFirestore("/content").then((returnedCollection) => {
      if (!Array.isArray(returnedCollection)) {
        throw new Error("This aint no collection");
      }
      setCollectionList(returnedCollection);
    });
  }, []);

  return (
    <>
      <div className="Contents">
        {displayType === "grid" && <ContentGrid entries={collectionList} />}
        {displayType === "list" && <ContentList entries={collectionList} />}
      </div>
    </>
  );
}
