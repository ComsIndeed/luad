import React, { Suspense, ReactNode } from "react";
import { useEffect, useState } from "react";
import { fetchFromFirestore } from "../Library/firestore";
import { Loading } from "../Reusables/Loading";
import { Link } from "react-router-dom";
import { paths } from "../Configuration/paths";
import notFoundImage from "../Assets/notFound.jpg";
import "animate.css";

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
      <Link
        to={paths.posts + entry.id}
        className="ContentCard animate__animated animate__fadeIn "
      >
        <img
          className="ContentCard-thumbnail"
          width={280}
          height={210}
          src={entry.head.headerImage.small || notFoundImage}
          alt={`Thumbnail for the article: "${entry.head.title}"`}
        />
        <div className="ContentCard-text">
          <h3 className="ContentCard-title"> {entry.head.title} </h3>
          <p className="ContentCard-author">
            {"By: "} {entry.head.author}
          </p>
        </div>
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

  useEffect(() => {
    fetchFromFirestore("/documents", undefined, true, true).then(
      (returnedCollection) => {
        setCollectionList(returnedCollection);
      }
    );
  }, []);

  return (
    <>
      <div className="Contents">
        <ContentGrid entries={collectionList} />
      </div>
    </>
  );
}
