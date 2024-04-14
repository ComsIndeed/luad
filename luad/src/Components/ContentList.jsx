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
import { Timestamp } from "firebase/firestore";

function formatTimeElapsed(date) {
  let originalDate = date;

  // Convert Firestore Timestamp to JavaScript Date if needed
  if (date instanceof Timestamp) {
    originalDate = date.toDate();
  }

  const now = new Date();
  const elapsedMilliseconds = now - originalDate;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  const elapsedMinutes = elapsedSeconds / 60;
  const elapsedHours = elapsedMinutes / 60;
  const elapsedDays = elapsedHours / 24;
  const elapsedWeeks = elapsedDays / 7;
  const elapsedMonths = elapsedDays / 30.44; // Average days in a month
  const elapsedYears = elapsedDays / 365.25; // Average days in a year

  if (elapsedYears >= 1) {
    return `${Math.floor(elapsedYears)}y`;
  } else if (elapsedMonths >= 1) {
    return `${Math.floor(elapsedMonths)}m`;
  } else if (elapsedWeeks >= 1) {
    return `${Math.floor(elapsedWeeks)}w`;
  } else if (elapsedDays >= 1) {
    return `${Math.floor(elapsedDays)}d`;
  } else if (elapsedHours >= 1) {
    return `${Math.floor(elapsedHours)}h`;
  } else if (elapsedMinutes >= 1) {
    return `${Math.floor(elapsedMinutes)}m`;
  } else {
    return `${Math.floor(elapsedSeconds)}s`;
  }
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
          alt={`Thumbnail for the article: "${entry?.head?.title}"`}
        />
        <div className="ContentCard-text">
          <span className="ContentCard-author">
            <Icon className="ContentCard-author-icon" icon="mdi:user" />
            <p className="ContentCard-author-text">{entry?.head?.author}</p>
            {entry?.head?.creationDateRaw && (
              <>
                <p> • {formatTimeElapsed(entry?.head?.creationDateRaw)}</p>
              </>
            )}
          </span>
          <h3 className="ContentCard-title"> {entry?.head?.title} </h3>
          <p className="ContentCard-body animate__animated animate__fadeInUp">
            {entry?.body
              ?.replaceAll("#", "")
              ?.replaceAll("*", "")
              ?.replaceAll("<br />", " ")
              ?.substr(0, 194)}
            ...
          </p>
        </div>
      </Link>
    </>
  );
}

// ! Handles categories, must not display when theres search queries
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

// ! Handles search queries and will handle categories if theres a search, only displays when theres a search
import { sortByMatch } from "../Library/searchLib";
function QueriedList({ entries, selectedCategory, searchBarValue }) {
  const [isEmpty, setIsEmpty] = useState(false);
  const [resultedList, setResultedList] = useState([]);

  useEffect(() => {
    // ! If no category
    if (selectedCategory === "all") {
      const sortedList = sortByMatch(entries, searchBarValue);
      setResultedList(sortedList);
    }
    // ! If with category
    else {
      console.log("ENTRIES: ", entries);
      const filteredEntries = entries.filter((entry) => {
        return entry?.head?.meta?.category?.includes(selectedCategory);
      });
      console.log("FILTERED ENTRIES: ", filteredEntries);
      const sortedList = sortByMatch(filteredEntries, searchBarValue);
      setResultedList(sortedList);
    }
  }, [selectedCategory, entries, searchBarValue]);

  return (
    <>
      {resultedList.length === 0 && <h2>Lookin' empty here..</h2>}
      <div className="ContentGrid">
        {resultedList.length > 0 &&
          resultedList.map((entry) => {
            return <ContentCard entry={entry} key={entry?.id} />;
          })}
      </div>
    </>
  );
}

export function ContentList({ selectedCategory, searchBarValue }) {
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
        {searchBarValue === "" ? (
          <ContentDisplay
            entries={collectionList}
            selectedCategory={selectedCategory}
          />
        ) : (
          <QueriedList
            entries={collectionList}
            searchBarValue={searchBarValue}
            selectedCategory={selectedCategory}
          />
        )}
      </div>
    </>
  );
}
