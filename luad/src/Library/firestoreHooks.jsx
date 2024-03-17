import { useEffect, useState } from "react";
import { uploadBlobsToFirestoreStorage } from "./firebaseStorage";
import { fetchFromFirestore, uploadDocumentsToFirestore } from "./firestore";

import Resizer from "react-image-file-resizer";
import { v4 } from "uuid";

function resize(size, file, output = "base64") {
  return new Promise((resolve) => {
    switch (size) {
      case "small":
        Resizer.imageFileResizer(
          file,
          360,
          240,
          "WEBP",
          30,
          0,
          (uri) => {
            resolve(uri);
          },
          output
        );
        break;
      case "medium":
        Resizer.imageFileResizer(
          file,
          560,
          420,
          "WEBP",
          30,
          0,
          (uri) => {
            resolve(uri);
          },
          output
        );
        break;
      case "large":
        Resizer.imageFileResizer(
          file,
          720,
          540,
          "WEBP",
          30,
          0,
          (uri) => {
            resolve(uri);
          },
          output
        );
        break;
      default:
        console.error("Invalid size provided:", size);
        resolve(null); // Handle invalid size gracefully
    }
  });
}

const createSrcSet = async (event, method = undefined, output = "base64") => {
  const file = event.target.files[0];
  const small = await resize("small", file, output);
  const medium = await resize("medium", file, output);
  const large = await resize("large", file, output);
  if (method) {
    method({ small, medium, large });
  }
  return { small, medium, large };
};

export function useDocumentInterface(database, storage, user = undefined) {
  const [objectEntry, setObjectEntry] = useState(null);
  const [objectEntryList, setObjectEntryList] = useState([]);
  const handlePushEntry = () => {
    if (objectEntry) {
      setObjectEntryList((prev) => {
        return [...prev, objectEntry];
      });
      setObjectEntry(null);
    }
  };

  const removeDraftByUuid = (uuidToRemove) => {
    setObjectEntryList((prevList) => {
      // Filter out the item with the specified uuid
      return prevList.filter((item) => item.entryID !== uuidToRemove);
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (!objectEntry?.operation || !objectEntry?.uuid) {
      setObjectEntry({
        ...objectEntry,
        operation: "POST",
        entryID: v4(),
        [name]: value,
      });
    } else {
      setObjectEntry({ ...objectEntry, [name]: value });
    }
  };

  const handleFileInputChange = (event) => {
    createSrcSet(event, undefined, "blob").then((blobs) => {
      setObjectEntry((prev) => {
        return {
          ...prev,
          headerImage: {
            large: blobs.large,
            medium: blobs.medium,
            small: blobs.small,
          },
        };
      });
    });
  };

  const createNewDocumentItem = (entry, srcSet = undefined) => {
    return {
      head: {
        title: entry?.title ?? null, // Fallback to null for missing title
        author: entry?.author ?? null, // Fallback to null for missing author
        creationDate: entry?.creationDate ?? null, // Fallback to null for missing creationDate
        creationDateRaw: entry?.creationDateRaw ?? null, // Fallback to null for missing creationDateRaw
        lastModified: entry?.lastModified ?? null, // Fallback to null for missing lastModified
        lastModifiedRaw: entry?.lastModifiedRaw ?? null, // Fallback to null for missing lastModifiedRaw
        headerImage: {
          large: srcSet?.large ?? null, // Fallback to null for missing large image
          medium: srcSet?.medium ?? null, // Fallback to null for missing medium image
          small: srcSet?.small ?? null, // Fallback to null for missing small image
          largeFullPath: srcSet?.largeRef.fullPath ?? null, // Fallback to null for missing large image
          mediumFullPath: srcSet?.mediumRef.fullPath ?? null, // Fallback to null for missing medium image
          smallFullPath: srcSet?.smallRef.fullPath ?? null, // Fallback to null for missing small image
        },
        meta: {
          category: entry?.categories || [], // Use an empty array for missing categories
        },
      },
      body: entry?.body ?? null, // Fallback to null for missing body
    };
  };

  const createDraftItemFromDocument = (documentItem) => {
    const { head, body } = documentItem;
    const {
      title,
      author,
      creationDate,
      creationDateRaw,
      lastModified,
      lastModifiedRaw,
      headerImage,
      meta,
    } = head;

    const srcSet = {
      large: headerImage?.large ?? null,
      medium: headerImage?.medium ?? null,
      small: headerImage?.small ?? null,
      largeRef: {
        fullPath: headerImage?.largeFullPath ?? null,
      },
      mediumRef: {
        fullPath: headerImage?.mediumFullPath ?? null,
      },
      smallRef: {
        fullPath: headerImage?.smallFullPath ?? null,
      },
    };

    return {
      title,
      author,
      creationDate,
      creationDateRaw,
      lastModified,
      lastModifiedRaw,
      ...srcSet,
      category: meta?.category ?? [],
      body,
    };
  };

  const uploadEntries = async (entryList = objectEntryList) => {
    let documentEntries = [];

    const uploadPromises = entryList.map(async (entry) => {
      const imageUrl = await uploadBlobsToFirestoreStorage(
        entry?.headerImage,
        entry?.title
      );

      return createNewDocumentItem(entry, imageUrl);
    });

    // Wait for all document creation promises to resolve
    documentEntries = await Promise.all(uploadPromises);

    const uploadResponse = await uploadDocumentsToFirestore(
      documentEntries,
      "/documents"
    );
  };

  const handleDiscardAllEntries = () => {
    setObjectEntryList(null);
  };

  const pushImportedDocumentEntry = (parsedDocumentObject) => {
    if (!!parsedDocumentObject) {
      setObjectEntryList((prev) => {
        return [
          ...prev,
          {
            ...parsedDocumentObject,
            operation: "POST",
            entryID: v4(),
          },
        ];
      });
    }
  };

  const getEntryByID = (id) => {
    return objectEntryList.filter((item) => item.entryID === id);
  };

  const editEntry = (id, changes) => {
    const filteredList = objectEntryList.filter((item) => item.entryID !== id);
    const originalItemIndex = objectEntryList.findIndex(
      (item) => item.entryID === id
    );
    if (originalItemIndex !== -1 && changes) {
      const updatedItem = {
        ...objectEntryList[originalItemIndex],
        ...changes,
      };
      const updatedList = [
        ...filteredList.slice(0, originalItemIndex),
        updatedItem,
        ...filteredList.slice(originalItemIndex),
      ];
      setObjectEntryList(updatedList);
    }
  };

  const editFirestoreDocument = (documentID, changes) => {
    fetchFromFirestore("/documents", documentID, true).then(
      (fetchedDocument) => {
        setObjectEntryList((prev) => {
          return [...prev, createDraftItemFromDocument(fetchedDocument)];
        });
      }
    );
  };

  return {
    objectEntry, // For viewing current entry
    objectEntryList, // For displaying queue
    handleInputChange, // For handling events
    handlePushEntry, // For handling events
    handleFileInputChange, // For handling events
    handleDiscardAllEntries,
    removeDraftByUuid,
    uploadEntries, // For uploading
    pushImportedDocumentEntry,
    getEntryByID,
    editEntry,
    //
    // createNewDocumentItem, // Not needed
  };
}
