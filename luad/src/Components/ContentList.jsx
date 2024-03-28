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
  const [currentHeaderImage, setCurrentHeaderImage] = useState(() => {
    if (entry?.head?.headerImage?.tiny) {
      return entry?.head?.headerImage?.tiny;
    } else if (!entry?.head?.headerImage?.tiny) {
      return entry?.head?.headerImage?.small;
    }
  });

  useEffect(() => {
    if (entry?.head?.headerImage?.tiny) {
      const image = new Image();
      image.src = entry?.head?.headerImage?.small;
      image.onload = () => {
        setCurrentHeaderImage(entry?.head?.headerImage?.small);
      };
    }
  }, [entry]);

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
          src={currentHeaderImage || notFoundImage}
          alt={`Thumbnail for the article: "${entry.head.title}"`}
        />
        <div className="ContentCard-text">
          <h3 className="ContentCard-title"> {entry.head.title} </h3>
          <p className="ContentCard-author">
            {"By: "} {entry.head.author}
          </p>
          <p className="ContentCard-body animate__animated animate__fadeInUp">
            {entry.body.substr(0, 194)}...
          </p>
        </div>
      </Link>
    </>
  );
}

function ContentGrid({ entries, selectedCategory }) {
  return (
    <>
      <div className="ContentGrid">
        {entries.length === 0 && <h2>Lookin' empty here..</h2>}
        {entries.length > 0 &&
          entries.map((fetchedDocument) => {
            if (selectedCategory === "all") {
              return (
                <ContentCard key={fetchedDocument.id} entry={fetchedDocument} />
              );
            }
            if (
              fetchedDocument?.head?.meta?.categories?.includes(
                selectedCategory
              )
            ) {
              return (
                <ContentCard key={fetchedDocument.id} entry={fetchedDocument} />
              );
            }
          })}
      </div>
    </>
  );
}

function ContentList({ entries }) {
  return (
    <>
      <div className="ContentList"></div>
    </>
  );
}

export function Contents({ selectedCategory }) {
  const [collectionList, setCollectionList] = useState(null);

  useEffect(() => {
    fetchFromFirestore("/documents", undefined, true, true).then(
      (returnedCollection) => {
        setCollectionList(returnedCollection);
      }
    );
  }, []);

  if (!collectionList) {
    return (
      <div className="Contents">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="Contents">
        <ContentGrid
          entries={collectionList}
          selectedCategory={selectedCategory}
        />
      </div>
    </>
  );
}
