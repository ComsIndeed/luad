import React, { Suspense, ReactNode } from "react";
import { useEffect, useState } from "react";
import { fetchFromFirestore } from "../Library/firestore";
import { Loading } from "../Reusables/Loading";
import { Link } from "react-router-dom";
import { paths } from "../Configuration/paths";
import notFoundImage from "../Assets/notFound.webp";
import "animate.css";
import { Icon } from "@iconify/react";
import { useScreenSize } from "../Library/customHooks";

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

  const { isDesktop } = useScreenSize();

  return (
    <>
      <Link
        to={paths.posts + entry.id}
        className="ContentCard animate__animated animate__fadeIn "
      >
        <img
          className="ContentCard-thumbnail"
          width={isDesktop ? 360 : 280}
          height={isDesktop ? 270 : 210}
          src={currentHeaderImage || notFoundImage}
          alt={`Thumbnail for the article: "${entry.head.title}"`}
        />
        <div className="ContentCard-text">
          <span className="ContentCard-author">
            <Icon className="ContentCard-author-icon" icon="mdi:user" />
            <p className="ContentCard-author-text">{entry.head.author}</p>
          </span>
          <h3 className="ContentCard-title"> {entry.head.title} </h3>
          <p className="ContentCard-body animate__animated animate__fadeInUp">
            {entry.body
              .replaceAll("#", "")
              .replaceAll("*", "")
              .replaceAll("<br />", " ")
              .substr(0, 194)}
            ...
          </p>
        </div>
      </Link>
    </>
  );
}

function ContentDisplay({ entries, selectedCategory }) {
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (
      selectedCategory != "all" &&
      entries?.filter((item) =>
        item?.head?.meta?.category.includes(selectedCategory)
      ).length === 0
    ) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [selectedCategory, entries]);

  return (
    <>
      {isEmpty && <h2>Lookin' empty here..</h2>}
      <div className="ContentGrid">
        {entries.length > 0 &&
          entries.map((fetchedDocument) => {
            if (
              selectedCategory === "all" ||
              fetchedDocument?.head?.meta?.category?.includes(selectedCategory)
            ) {
              return (
                <ContentCard key={fetchedDocument.id} entry={fetchedDocument} />
              );
            }
            return null; // Render nothing if the entry doesn't match the selected category
          })}
      </div>
    </>
  );
}

export function ContentList({ selectedCategory }) {
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
        <ContentDisplay
          entries={collectionList}
          selectedCategory={selectedCategory}
        />
      </div>
    </>
  );
}
