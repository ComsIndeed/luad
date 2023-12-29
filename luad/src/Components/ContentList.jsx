import React, { Suspense, ReactNode } from "react";
import { useEffect, useState } from "react";
import { fetchFromFirestore } from "../Library/firestoreControls";
import { Loading } from "../Reusables/Loading";
import { Link } from "react-router-dom";
import { paths } from "../Configuration/paths";

function SuspendedDisplay({ children }) {
  return (
    <>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </>
  );
}

function ContentCard({ entry }) {
  return (
    <>
      <Link to={paths.posts + entry.id} className="ContentCard">
        <img
          className="ContentCard-thumbnail"
          height={250}
          src={entry.headerImage}
          alt={`Thumbnail for the article: "${entry.title}"`}
        />
        <h3 className="ContentCard-title"> {entry.title} </h3>
      </Link>
    </>
  );
}

function ContentGrid({ entries }) {
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

function ContentList({ entries }) {
  console.log(entries);
  return (
    <>
      <div className="ContentList"></div>
    </>
  );
}

export function Contents() {
  const [collectionList, setCollectionList] = useState([]);
  const [displayType, setDisplayType] = useState("grid");

  useEffect(() => {
    fetchFromFirestore("/content").then((returnedCollection) => {
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
