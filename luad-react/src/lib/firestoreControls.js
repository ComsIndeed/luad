import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

// =======================

// 6 articles, 3 editorials, 2 literature
const data1 = {
  articles: [
    {
      title: "Exploring the Deep Sea",
      content: "Dive into the mysteries of the ocean depths.",
      createdAt: "2023-03-15T09:00:00Z",
    },
    {
      title: "The Art of Coding",
      content: "Unraveling the beauty of programming.",
      createdAt: "2023-04-22T12:30:00Z",
    },
    {
      title: "Space Travel Adventures",
      content: "Journey through the cosmos and beyond.",
      createdAt: "2023-05-10T18:45:00Z",
    },
    {
      title: "The World of Microorganisms",
      content: "Tiny life forms with big impacts.",
      createdAt: "2023-06-28T08:15:00Z",
    },
    {
      title: "Innovations in Green Energy",
      content: "Revolutionizing the way we power our world.",
      createdAt: "2023-07-17T16:20:00Z",
    },
    {
      title: "Discovering Ancient Civilizations",
      content: "Unearthing the secrets of bygone eras.",
      createdAt: "2023-08-05T14:10:00Z",
    },
  ],
  editorials: [
    {
      title: "Opinion: Future of Artificial Intelligence",
      content: "Navigating the ethical landscapes of AI.",
      createdAt: "2023-09-12T10:45:00Z",
    },
    {
      title: "Environmental Challenges",
      content: "Addressing urgent issues for a sustainable future.",
      createdAt: "2023-10-08T17:55:00Z",
    },
    {
      title: "The Role of Technology in Education",
      content: "Transforming the way we learn and teach.",
      createdAt: "2023-11-19T11:25:00Z",
    },
  ],
  literature: [
    {
      title: "Poetry Collection: Whispers of the Wind",
      content: "Verses that dance with the breeze.",
      createdAt: "2023-12-07T13:40:00Z",
    },
    {
      title: "Short Stories: Tales from the Enchanted Forest",
      content: "Magical narratives of mystical realms.",
      createdAt: "2023-01-30T22:05:00Z",
    },
  ],
};

// 6 articles, 3 editorials, 4 literature
const data2 = {
  articles: [
    {
      title: "Exploring the Deep Sea",
      content: "Dive into the mysteries of the ocean depths.",
      createdAt: "2023-03-15T09:00:00Z",
    },
    {
      title: "The Art of Coding",
      content: "Unraveling the beauty of programming.",
      createdAt: "2023-04-22T12:30:00Z",
    },
    {
      title: "Space Travel Adventures",
      content: "Journey through the cosmos and beyond.",
      createdAt: "2023-05-10T18:45:00Z",
    },
    {
      title: "The World of Microorganisms",
      content: "Tiny life forms with big impacts.",
      createdAt: "2023-06-28T08:15:00Z",
    },
    {
      title: "Innovations in Green Energy",
      content: "Revolutionizing the way we power our world.",
      createdAt: "2023-07-17T16:20:00Z",
    },
    {
      title: "Discovering Ancient Civilizations",
      content: "Unearthing the secrets of bygone eras.",
      createdAt: "2023-08-05T14:10:00Z",
    },
  ],
  editorials: [
    {
      title: "Opinion: Future of Artificial Intelligence",
      content: "Navigating the ethical landscapes of AI.",
      createdAt: "2023-09-12T10:45:00Z",
    },
    {
      title: "Environmental Challenges",
      content: "Addressing urgent issues for a sustainable future.",
      createdAt: "2023-10-08T17:55:00Z",
    },
    {
      title: "New Editorial: Innovations in Healthcare",
      content: "Revolutionizing medical care for a healthier world.",
      createdAt: "2023-11-25T09:30:00Z",
    },
  ],
  literature: [
    {
      title: "Poetry Collection: Whispers of the Wind",
      content: "Verses that dance with the breeze.",
      createdAt: "2023-12-07T13:40:00Z",
    },
    {
      title: "Short Stories: Tales from the Enchanted Forest",
      content: "Magical narratives of mystical realms.",
      createdAt: "2023-01-30T22:05:00Z",
    },
    {
      title: "Epic Fantasy: The Chronicles of Eloria",
      content: "Embark on a journey through a fantastical realm.",
      createdAt: "2023-02-15T15:20:00Z",
    },
    {
      title: "Romantic Poetry: Whispers of the Heart",
      content: "Capturing the essence of love in poetic verses.",
      createdAt: "2023-03-05T18:10:00Z",
    },
  ],
};

// =======================

// Initializes cache if it doesnt exist
export const initCache = () => {
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
export const updateCache = (path, newData) => {
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

// FIRESTORE WRITES
// ===================================

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
