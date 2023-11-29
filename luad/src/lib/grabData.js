import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

// export const importCollection = async (
//   method,
//   path,
//   docId,
//   verbose = false
// ) => {
//   let rawData;
//   let filteredData;

//   if (docId) {
//     // Fetching a single document
//     const docRef = doc(db, path, docId);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       rawData = docSnap.data();
//       filteredData = rawData; // Directly assign the document data to filteredData
//       if (verbose) {
//         console.log("> Read 1 document");
//       }
//     } else {
//       console.log("Document not found:", docId);
//       return;
//     }
//   } else {
//     // Fetching a collection
//     const collectionRef = collection(db, path);
//     const querySnapshot = await getDocs(collectionRef);

//     rawData = querySnapshot.docs;
//     filteredData = rawData.map((document) => {
//       const data = document.data();
//       const id = document.id;
//       return { ...data, id }; // Add ID to each document data
//     });
//     if (verbose) {
//       console.log(`> Read ${filteredData.length} documents.`);
//     }
//   }

//   method(filteredData);
// };

// {id: "id goes here"}
// Array.prototype.searchThoseWith = function (query) {
//   let bucket = this;
//   const queryKeys = Object.keys(query)
//   queryKeys.forEach((queryKey) => {
//     bucket.forEach((object) => {
//       if(object[queryKey] == undefined) {}
//       if(object[queryKey] != query[queryKey]) {
//         bucket = bucket.filter()
//       }
//     })
//   })
// };

export const importCollection = async (
  method,
  path,
  docId,
  verbose = false,
  forceRevalidate = false
) => {
  const cooldownDuration = 5000; // 5 seconds in milliseconds

  // Check the timestamp of the last revalidation
  const lastRevalidateTimestamp = parseInt(
    sessionStorage.getItem("lastRevalidateTimestamp") || "0"
  );

  // Calculate the current timestamp
  const currentTimestamp = Date.now();

  // Check if the cooldown is still in effect
  if (
    forceRevalidate &&
    currentTimestamp - lastRevalidateTimestamp < cooldownDuration
  ) {
    console.error("Cooldown in effect. Please wait.");
    return;
  }

  let rawData;
  let filteredData;

  // Check if cached data exists in session
  const cachedCollections = sessionStorage.getItem("cachedCollections");
  const cachedData = cachedCollections ? JSON.parse(cachedCollections) : {};

  if (!forceRevalidate && cachedData[path]) {
    // Use cached data if available and forceRevalidate is false
    if (docId) {
      // Fetching a single document
      // console.log(
      //   cachedData[path].filter((obj) => {
      //     return Object.entries({ id: "A2bG9h31jDQAeKlZvPqx" }).every(
      //       ([key, value]) => obj[key] === value
      //     );
      //   })
      // );

      if (
        cachedData[path].filter((obj) => {
          return Object.entries({ id: "A2bG9h31jDQAeKlZvPqx" }).every(
            ([key, value]) => obj[key] === value
          );
        })
      ) {
        rawData = cachedData[path].filter((obj) => {
          return Object.entries({ id: "A2bG9h31jDQAeKlZvPqx" }).every(
            ([key, value]) => obj[key] === value
          );
        });
        filteredData = rawData[0];
        console.log(filteredData);
        if (verbose) {
          console.log("> Read 1 document from cache");
        }
      } else {
        console.log("Document not found in cache:", docId);
        return;
      }
    } else {
      // Fetching a collection
      rawData = cachedData[path];
      filteredData = rawData.map((document) => ({ ...document }));
      if (verbose) {
        console.log(`> Read ${filteredData.length} documents from cache.`);
      }
    }
  } else {
    // Fetch data from Firebase if not found in cache or forceRevalidate is true
    if (docId) {
      // Fetching a single document
      const docRef = doc(db, path, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        rawData = docSnap.data();
        filteredData = rawData;
        if (verbose) {
          console.log("> Read 1 document from Firebase");
        }
      } else {
        console.log("Document not found in Firebase:", docId);
        return;
      }
    } else {
      // Fetching a collection
      const collectionRef = collection(db, path);
      const querySnapshot = await getDocs(collectionRef);

      rawData = querySnapshot.docs.map((document) => {
        const data = document.data();
        const id = document.id;
        return { ...data, id }; // Add ID to each document data
      });
      filteredData = rawData;

      // Update cache with fetched data
      sessionStorage.setItem("cachedCollections", JSON.stringify(cachedData));

      // Update the timestamp of the last revalidation
      sessionStorage.setItem(
        "lastRevalidateTimestamp",
        currentTimestamp.toString()
      );

      if (verbose) {
        console.log(`> Read ${filteredData.length} documents from Firebase.`);
      }
    }
  }

  method(filteredData);
};
