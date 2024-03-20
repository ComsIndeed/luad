import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

// =======================

// Initializes cache if it doesnt exist
const initCache = () => {
  if (!sessionStorage.getItem("firestoreCache")) {
    sessionStorage.setItem("firestoreCache", "{}");
  }
};

// Checks if the specified collection or document exists in the cache
const hasCache = (path, doc = undefined) => {
  const cacheData = JSON.parse(sessionStorage.getItem("firestoreCache")) || {};
  const output =
    cacheData && // If cache data has stuff
    cacheData.hasOwnProperty(path) && // If cache data has said path
    cacheData[path].length > 0 && // If cache data has items
    (!doc ||
      (cacheData[path] && cacheData[path].some((obj) => obj.id === doc)));
  return output;
};

// Function to update cache data
const updateCache = (path, newData) => {
  if (!sessionStorage.getItem("firestoreCache")) {
    console.error(`Key "firestoreCache" not found in SessionStorage.`);
  }
  let sessionStorageData = JSON.parse(sessionStorage.getItem("firestoreCache"));

  // If the new data is an array
  if (Array.isArray(newData)) {
    sessionStorageData[path] = newData;

    // If the new data is not defined
  } else if (newData === undefined) {
    console.error(`ERROR: newData is undefined.`);
    console.error(newData);

    // If the new data is an object or anything else
  } else {
    if (!sessionStorageData[path]) {
      sessionStorageData[path] = [];
    }
    for (
      let postIndex = 0;
      postIndex < sessionStorageData[path].length || 0;
      postIndex++
    ) {
      if (sessionStorageData[path][postIndex].id === newData.id) {
        sessionStorageData[path][postIndex] = newData;
      }
    }
  }

  sessionStorage.setItem("firestoreCache", JSON.stringify(sessionStorageData));
  return sessionStorageData;
};

// Delete document from cache
const deleteFromCache = (docID, path = "/content") => {
  let cacheData = JSON.parse(sessionStorage.getItem("firestoreCache"));
  let indexOfDocumentInPath = undefined;
  cacheData[path].forEach((documentObject, index) => {
    if (documentObject.id === docID) {
      indexOfDocumentInPath = index;
    }
  });
  if (indexOfDocumentInPath != undefined) {
    cacheData[path].splice(indexOfDocumentInPath, 1);
    sessionStorage.setItem("firestoreCache", JSON.stringify(cacheData));
  } else {
    console.error(
      "Error: No such thing as a document with the ID of " + docID + " found."
    );
  }
};

// Delete document from cache
const addToCache = (document, path = "/content") => {
  let cacheData = JSON.parse(sessionStorage.getItem("firestoreCache"));
  cacheData[path].push(document);
  sessionStorage.setItem("firebaseCache", JSON.stringify(cacheData));
};

// Fetch from cache
const requestFromCache = (path, doc = undefined) => {
  const sessionStorageData = JSON.parse(
    sessionStorage.getItem("firestoreCache")
  );

  if (!sessionStorageData) {
    console.error(
      `Cache with key "firestoreCache" not found in SessionStorage.`
    );
    return undefined; // or throw an error, depending on your requirements
  }

  const pathData = sessionStorageData[path];

  if (!pathData) {
    console.error(`Path ${path} not found in cache.`);
    return undefined;
  }

  if (doc) {
    return pathData.find((obj) => obj.id === doc);
  } else {
    return pathData;
  }
};

// Fetch from Firestore
const requestFromFirestore = async (
  path,
  docID = undefined,
  isVerbose = false
) => {
  try {
    if (docID) {
      const retrievedData = await getDoc(doc(db, path, docID));
      const outputData = {
        ...retrievedData.data(),
        id: retrievedData.id,
      };

      if (isVerbose) {
        console.log(outputData);
        return outputData;
      } else {
        return outputData;
      }
    } else {
      const retrievedData = await getDocs(collection(db, path));
      const outputData = retrievedData.docs.map((document) => {
        const data = document.data();
        const id = document.id;
        return { ...data, id };
      });
      if (isVerbose) {
        console.log(outputData);
        return outputData;
      } else {
        return outputData;
      }
    }
  } catch (error) {
    console.error("Firestore read error:", error);
    throw error;
  }
};

// Cooldown
const Cooldown = {
  // Initialization method to set an initial cooldown value
  init: () => {
    const initialCooldown = 0;
    localStorage.setItem("Cooldown", initialCooldown.toString());
  },

  set: (durationInSeconds) => {
    const cooldownEndTime = Date.now() + durationInSeconds * 1000;
    localStorage.setItem("Cooldown", cooldownEndTime.toString());
  },

  get: () => {
    const cooldownEndTime = parseInt(localStorage.getItem("Cooldown"), 10);
    if (!cooldownEndTime || cooldownEndTime < Date.now()) {
      return 0;
    }
    const remainingTime = Math.ceil((cooldownEndTime - Date.now()) / 1000);
    return remainingTime;
  },
};

// Fetch data from cache or Firebase
// Forcefully fetches from Firebase if forceRevalidate is true
// Returns fetched data
export const fetchFromFirestore = async (
  path,
  doc = undefined,
  forceRevalidate = false,
  isVerbose = false
) => {
  initCache(); // sets a key in SessionStorage with value of "{}" as string

  // // If force revalidate and still has cooldown
  // if (forceRevalidate && Cooldown.get() > 0) {
  //   console.error(
  //     `Cooldown has ${Cooldown.get()} seconds remaining. Data retrieved from cache.`
  //   );
  //   return requestFromCache(path, doc);
  // }

  // IF revalidate: Fetch from Firestore if no cooldown or forceRevalidate is true
  if (forceRevalidate || !hasCache(path, doc)) {
    Cooldown.set(5); // 5-second cooldown
    if (doc) {
      const requestedData = await requestFromFirestore(path, doc);
      if (isVerbose) {
        console.log(
          `\nFetched 1 document from Firestore\nPath: ${path}\nDocument ID: ${doc}`
        );
        console.log(requestedData);
        updateCache(path, requestedData);
        return requestedData;
      } else {
        updateCache(path, requestedData);
        return requestedData;
      }
    } else {
      const requestedData = await requestFromFirestore(
        path,
        undefined,
        isVerbose
      );
      if (isVerbose) {
        console.log(
          `\nFetched ${requestedData.length} document(s) from Firestore\nPath: ${path}`
        );
        console.log(requestedData);
        updateCache(path, requestedData);
        return requestedData;
      } else {
        updateCache(path, requestedData);
        return requestedData;
      }
    }
  }

  // IF not revalidate and has cache: Fetch from cache
  if (!forceRevalidate && hasCache(path, doc)) {
    if (doc) {
      const requestedData = requestFromCache(path, doc);
      if (isVerbose) {
        console.log(
          `\nFetched 1 document from cache\nPath: ${path}\nDocument ID: ${doc}`
        );
        console.log(requestedData);
        return requestedData;
      } else {
        return requestedData;
      }
    } else {
      const requestedData = requestFromCache(path);
      if (isVerbose) {
        console.log(
          `\nFetched ${requestedData.length} document(s) from cache\nPath: ${path}`
        );
        console.log(requestedData);
        return requestedData;
      } else {
        return requestedData;
      }
    }
  }
};

// ! FIRESTORE WRITES
// ! ===================================

// Interface for Firestore Documents
//
// DocumentItem:
//      head: object
//          title: string
//          headerImage: string
//          author: string
//          creationDateRaw: integer
//          creationDate: vector
//          lastModifiedRaw: integer
//          lastModified: vector
//          meta: object
//              category: string[]
//      body: string (markdown)
//

export const addDocToFirestore = async (
  data,
  method = undefined,
  verbose = false,
  path = "/content"
) => {
  try {
    const documentRef = await addDoc(collection(db, path), data);
    if (method != undefined) {
      addToCache(data);
      method(requestFromCache(path));

      if (verbose) {
        console.log(
          `Document added to collection ${path} with ID: ${documentRef.id}`
        );
      }
    } else {
      addToCache(data);

      if (verbose) {
        console.log(
          `Document added to collection ${path} with ID: ${documentRef.id}`
        );
      }
    }
  } catch (error) {
    console.error(`Error:`, error);
  }
};

export const removeDocFromFirestore = async (
  docID,
  method = undefined,
  isVerbose = false,
  path = "/content"
) => {
  fetchFromFirestore(path, docID).then((doc) => {
    const sizes = ["small", "medium", "large"];
    if (
      doc?.head?.headerImage?.smallFullPath ||
      doc?.head?.headerImage?.mediumFullPath ||
      doc?.head?.headerImage?.largeFullPath
    ) {
      sizes.forEach((size) => {
        const fullPath = `${size}FullPath`;
        deleteObject(ref(storage, doc?.head?.headerImage[fullPath])).catch(
          () => {
            console.error(
              "SOMETHING WENT WRONG WITH DELETING. PATH: ",
              doc?.head?.headerImage[fullPath]
            );
          }
        );
      });
    }
  });
  await deleteDoc(doc(db, path, docID))
    .then((result) => {
      deleteFromCache(docID, path);
      if (method != undefined) {
        method(requestFromCache(path));
        if (isVerbose) {
          console.log(result);
          return result;
        } else {
          return result;
        }
      } else {
        if (isVerbose) {
          console.log(result);
          return result;
        } else {
          return result;
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export const deleteHeaderImages = async (docID, path = "/documents") => {
  try {
    const docRef = doc(db, path, docID);
    const docSnapshot = await getDoc(docRef);
    const docData = docSnapshot.data();

    const sizes = ["small", "medium", "large"];
    sizes.forEach(async (size) => {
      const fullPathKey = `${size}FullPath`;
      const fullPath = docData?.head?.headerImage?.[fullPathKey];
      if (fullPath) {
        // Delete image from Firebase Storage
        await deleteObject(ref(storage, fullPath));
      }
    });

    // Update Firestore document to remove headerImage fields
    await updateDoc(docRef, {
      "head.headerImage": {
        smallFullPath: null,
        mediumFullPath: null,
        largeFullPath: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting header images:", error);
    return { success: false, error };
  }
};

export async function uploadDocumentToFirestore(
  documentObject,
  path = "/documents"
) {
  try {
    const res = await addDoc(collection(db, path), documentObject);
    return res;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error; // Or return an error object
  }
}

export async function uploadDocumentsToFirestore(
  documentObjects,
  path = "/documents",
  method = undefined
) {
  try {
    const uploadPromises = documentObjects.map((documentObject) => {
      return uploadDocumentToFirestore(documentObject, path);
    });

    const uploadedDocuments = await Promise.all(uploadPromises);

    if (method) {
      method(uploadedDocuments);
    }

    return uploadedDocuments;
  } catch (error) {
    console.error("Error uploading documents:", error);
    throw error; // Or return an error object
  }
}
