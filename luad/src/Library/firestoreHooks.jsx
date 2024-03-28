import { useEffect, useState } from "react";
import { uploadBlobsToFirestoreStorage } from "./firebaseStorage";
import {
  deleteHeaderImages,
  fetchFromFirestore,
  uploadDocumentsToFirestore,
} from "./firestore";

import Resizer from "react-image-file-resizer";
import { v4 } from "uuid";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

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
      case "tiny":
        Resizer.imageFileResizer(
          file,
          8,
          6,
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

export const createSrcSet = async (
  event,
  method = undefined,
  output = "base64"
) => {
  const file = event.target.files[0];
  const small = await resize("small", file, output);
  const medium = await resize("medium", file, output);
  const large = await resize("large", file, output);
  const tiny = await resize("tiny", file, output);
  if (method) {
    method({ small, medium, large, tiny });
  }
  return { small, medium, large, tiny };
};

export function useDocumentInterface(database, storage, user = undefined) {
  const [objectEntry, setObjectEntry] = useState(null);
  const [objectEntryList, setObjectEntryList] = useState([]);

  useEffect(() => {
    console.log("OBJECT ENTRY: ", objectEntry);
  }, [objectEntry]);

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

  const setObjectEntryCategory = (categoryInput) => {
    setObjectEntry((prev) => {
      return {
        ...prev,
        categories: categoryInput,
      };
    });
  };

  const handleFileInputChange = (event) => {
    createSrcSet(event, undefined, "blob").then((blobs) => {
      setObjectEntry((prev) => {
        console.log({
          ...prev,
          headerImage: {
            large: blobs.large,
            medium: blobs.medium,
            small: blobs.small,
            tiny: blobs.tiny,
          },
        });
        return {
          ...prev,
          headerImage: {
            large: blobs.large,
            medium: blobs.medium,
            small: blobs.small,
            tiny: blobs.tiny,
          },
        };
      });
    });
  };

  const createNewDocumentItem = (
    entry,
    srcSet = undefined,
    keepUndefined = true
  ) => {
    // Destructure entry and srcSet with default empty objects
    const {
      title,
      author,
      creationDate,
      creationDateRaw,
      lastModified,
      lastModifiedRaw,
      body,
      categories,
    } = entry || {};

    const {
      large,
      medium,
      small,
      tiny,
      largeRef,
      mediumRef,
      smallRef,
      tinyRef,
    } = srcSet || {};

    // Function to filter out undefined values if keepUndefined is false
    const filterUndefined = (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(
          ([_, value]) => keepUndefined || value !== undefined
        )
      );

    return {
      head: {
        // Include properties only if they are defined
        ...(title && { title }),
        ...(author && { author }),
        ...(creationDate && { creationDate }),
        ...(creationDateRaw && { creationDateRaw }),
        ...(lastModified && { lastModified }),
        ...(lastModifiedRaw && { lastModifiedRaw }),
        headerImage: {
          // Include properties only if they are defined
          ...(large && { large }),
          ...(medium && { medium }),
          ...(small && { small }),
          ...(tiny && { tiny }),
          ...(largeRef &&
            largeRef.fullPath && { largeFullPath: largeRef.fullPath }),
          ...(mediumRef &&
            mediumRef.fullPath && { mediumFullPath: mediumRef.fullPath }),
          ...(smallRef &&
            smallRef.fullPath && { smallFullPath: smallRef.fullPath }),
          ...(tinyRef &&
            tinyRef.fullPath && { tinyFullPath: tinyRef.fullPath }),
        },
        meta: {
          // Use an empty array for missing categories
          category: categories || [],
        },
      },
      // Include body only if it is defined
      ...(body && { body }),
      // Filter out undefined values if keepUndefined is false
      ...(!keepUndefined && {
        head: filterUndefined({
          title,
          author,
          creationDate,
          creationDateRaw,
          lastModified,
          lastModifiedRaw,
          headerImage: {
            large,
            medium,
            small,
            largeFullPath: largeRef && largeRef.fullPath,
            mediumFullPath: mediumRef && mediumRef.fullPath,
            smallFullPath: smallRef && smallRef.fullPath,
          },
          meta: { category: categories || [] },
        }),
        body: body,
      }),
    };
  };

  // const updateDocumentItem = (existingItem, updatedValues) => {
  //   if (!existingItem || typeof existingItem !== "object" || !updatedValues) {
  //     return existingItem;
  //   }

  //   // Merge updated values with existing item
  //   const updatedItem = { ...existingItem, ...updatedValues };

  //   // Remove undefined and null properties from the merged item
  //   for (const key in updatedItem) {
  //     if (updatedItem.hasOwnProperty(key)) {
  //       if (updatedItem[key] === undefined || updatedItem[key] === null) {
  //         delete updatedItem[key];
  //       } else if (typeof updatedItem[key] === "object") {
  //         // Recursively remove undefined and null properties from nested objects
  //         updatedItem[key] = removeNullUndefined(updatedItem[key]);
  //       }
  //     }
  //   }

  //   return updatedItem;
  // };

  // const createDraftItemFromDocument = (documentItem) => {
  //   const { head, body } = documentItem;
  //   const {
  //     title,
  //     author,
  //     creationDate,
  //     creationDateRaw,
  //     lastModified,
  //     lastModifiedRaw,
  //     headerImage,
  //     meta,
  //   } = head;

  //   const srcSet = {
  //     large: headerImage?.large ?? null,
  //     medium: headerImage?.medium ?? null,
  //     small: headerImage?.small ?? null,
  //     largeRef: {
  //       fullPath: headerImage?.largeFullPath ?? null,
  //     },
  //     mediumRef: {
  //       fullPath: headerImage?.mediumFullPath ?? null,
  //     },
  //     smallRef: {
  //       fullPath: headerImage?.smallFullPath ?? null,
  //     },
  //   };

  //   return {
  //     title,
  //     author,
  //     creationDate,
  //     creationDateRaw,
  //     lastModified,
  //     lastModifiedRaw,
  //     ...srcSet,
  //     category: meta?.category ?? [],
  //     body,
  //   };
  // };

  const uploadEntries = async (entryList = objectEntryList) => {
    let documentEntries = [];
    console.log(entryList);

    const uploadPromises = entryList?.map(async (entry) => {
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
    setObjectEntryList([]);
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

  const removeNullUndefined = (obj) => {
    return Object.entries(obj)
      .filter(([key, value]) => value !== null && value !== undefined)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };

  // const pushFirestoreEditToDraft = () => {};

  const convertImageReferencesToFullPaths = (srcSet) => {
    if (!srcSet || typeof srcSet !== "object") {
      return srcSet;
    }

    // Destructure the srcSet object
    const { largeRef, mediumRef, smallRef } = srcSet;

    // Create a new object with full paths for image references
    const srcSetWithFullPaths = {
      largeRef: { fullPath: largeRef?.fullPath ?? null },
      mediumRef: { fullPath: mediumRef?.fullPath ?? null },
      smallRef: { fullPath: smallRef?.fullPath ?? null },
      tinyRef: { fullPath: tinyRef?.fullPath ?? null },
    };

    return srcSetWithFullPaths;
  };

  const updateFirestoreDocument = (
    documentID,
    changes,
    path = "/documents",
    fileName = undefined
  ) => {
    let finalChanges = createNewDocumentItem(changes, undefined, false);
    if (changes?.headerImage) {
      deleteHeaderImages(documentID).then(() => {
        uploadBlobsToFirestoreStorage(changes?.headerImage, undefined).then(
          (headerImageObject) => {
            const headerImageOutput = {
              tiny: headerImageObject.tiny,
              small: headerImageObject.small,
              medium: headerImageObject.medium,
              large: headerImageObject.large,
              tinyFullPath: headerImageObject.tinyRef.fullPath,
              smallFullPath: headerImageObject.smallRef.fullPath,
              mediumFullPath: headerImageObject.mediumRef.fullPath,
              largeFullPath: headerImageObject.largeRef.fullPath,
            };
            finalChanges.head.headerImage = headerImageOutput;
            console.log("RECEIVED IMAGES: ", removeNullUndefined(finalChanges));
            setDoc(
              doc(db, path, documentID),
              removeNullUndefined(finalChanges),
              {
                merge: true,
              }
            ).then((e) => {
              console.log(e);
            });
          }
        );
      });
    } else {
      delete finalChanges.head.headerImage;
      console.log("NO HEADER IMAGE: ", removeNullUndefined(finalChanges));
      setDoc(doc(db, path, documentID), removeNullUndefined(finalChanges), {
        merge: true,
      });
    }
  };

  const updateDraftHeaderImage = (event, entryID) => {
    createSrcSet(event, undefined, "blob").then((sourceSet) => {});
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
    updateFirestoreDocument,
    setObjectEntryCategory,
    //
    // createNewDocumentItem, // Not needed
  };
}
