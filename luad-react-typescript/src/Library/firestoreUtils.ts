import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../Library/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

// Interfaces
export interface FirestoreDocument {
  id?: string;
  title?: string;
  content?: string;
  author?: string;
  headerImage?: string;
  isLargeCard?: boolean;
  headerImageReference?: string;
}

// Initializes cache if it doesn't exist
export const initCache = () => {
  const existingCache = sessionStorage.getItem("firestoreCache");
  if (!existingCache) {
    sessionStorage.setItem("firestoreCache", "{}");
  }
};

// Checks if the specified collection or document exists in the cache
const hasCache = (path: string, doc?: string) => {
  const cacheData = JSON.parse(
    sessionStorage.getItem("firestoreCache") || "{}"
  );
  const output =
    cacheData &&
    cacheData.hasOwnProperty(path) &&
    cacheData[path].length > 0 &&
    (!doc ||
      (cacheData[path] &&
        cacheData[path].some((obj: FirestoreDocument) => obj.id === doc)));
  return output;
};

// Function to update cache data
export const updateCache = (
  path: string,
  newData: FirestoreDocument | FirestoreDocument[]
) => {
  const existingCache = sessionStorage.getItem("firestoreCache") || "{}";
  let sessionStorageData = JSON.parse(existingCache);

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
const deleteFromCache = (docID: string, path = "/content") => {
  let cacheData = JSON.parse(sessionStorage.getItem("firestoreCache") || "{}");
  let indexOfDocumentInPath: number | undefined = undefined;
  cacheData[path].forEach(
    (documentObject: FirestoreDocument, index: number) => {
      if (documentObject.id === docID) {
        indexOfDocumentInPath = index;
      }
    }
  );
  if (indexOfDocumentInPath !== undefined) {
    cacheData[path].splice(indexOfDocumentInPath, 1);
    sessionStorage.setItem("firestoreCache", JSON.stringify(cacheData));
  } else {
    console.error(
      "Error: No such thing as a document with the ID of " + docID + " found."
    );
  }
};

// Delete document from cache
const addToCache = (document: FirestoreDocument, path = "/content") => {
  let cacheData = JSON.parse(sessionStorage.getItem("firestoreCache") || "{}");
  cacheData[path].push(document);
  sessionStorage.setItem("firebaseCache", JSON.stringify(cacheData));
};

// Fetch from cache
const requestFromCache = (path: string, doc?: string) => {
  const existingCache = sessionStorage.getItem("firestoreCache");
  const sessionStorageData = JSON.parse(existingCache || "{}");

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
    return pathData.find((obj: FirestoreDocument) => obj.id === doc);
  } else {
    return pathData;
  }
};

// Fetch from Firestore
const requestFromFirestore = async (
  path: string,
  docID?: string,
  isVerbose = false
): Promise<FirestoreDocument | FirestoreDocument[]> => {
  try {
    if (docID) {
      const retrievedData = await getDoc(doc(db, path, docID));
      const outputData: FirestoreDocument = {
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
  init: () => {
    const initialCooldown = 0;
    localStorage.setItem("Cooldown", initialCooldown.toString());
  },

  set: (durationInSeconds: number) => {
    const cooldownEndTime = Date.now() + durationInSeconds * 1000;
    localStorage.setItem("Cooldown", cooldownEndTime.toString());
  },

  get: () => {
    const cooldownEndTime = parseInt(
      localStorage.getItem("Cooldown") || "0",
      10
    );
    if (!cooldownEndTime || cooldownEndTime < Date.now()) {
      return 0;
    }
    const remainingTime = Math.ceil((cooldownEndTime - Date.now()) / 1000);
    return remainingTime;
  },
};

// Fetch data from cache or Firebase
export const fetchFromFirestore = async (
  path: string,
  doc?: string,
  forceRevalidate = false,
  isVerbose = false
): Promise<FirestoreDocument | FirestoreDocument[] | undefined> => {
  initCache(); // sets a key in SessionStorage with value of "{}" as string

  // If force revalidate and still has cooldown
  if (forceRevalidate && Cooldown.get() > 0) {
    console.error(
      `Cooldown has ${Cooldown.get()} seconds remaining. Data retrieved from cache.`
    );
    return requestFromCache(path, doc);
  }

  // IF revalidate: Fetch from Firestore if no cooldown or forceRevalidate is true
  else if ((forceRevalidate && Cooldown.get() === 0) || !hasCache(path, doc)) {
    Cooldown.set(5); // 5-second cooldown
    if (doc) {
      const requestedData = await requestFromFirestore(path, doc);
      if (Array.isArray(requestedData)) {
        throw new Error("Received an array");
      }
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
      if (!Array.isArray(requestedData)) {
        throw new Error("Did not receive array");
      }
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

  return undefined;
};

// FIRESTORE WRITES
// ===================================

export const addDocToFirestore = async (
  data: FirestoreDocument,
  method?: (data: FirestoreDocument | FirestoreDocument[]) => void,
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
  docID: string,
  method?: (data: FirestoreDocument | FirestoreDocument[]) => void,
  isVerbose = false,
  path = "/content"
) => {
  fetchFromFirestore(path, docID).then((doc) => {
    console.log(doc);
    if (Array.isArray(doc)) {
      throw new Error("Thats an array");
    }
    if (doc && doc.headerImageReference) {
      deleteObject(ref(storage, doc.headerImageReference))
        .then(() => {
          console.log("Successfully deleted " + doc.headerImageReference);
        })
        .catch((err) => {
          console.error(err);
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
