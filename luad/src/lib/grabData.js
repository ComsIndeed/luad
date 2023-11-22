import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export const importCollection = async (method, path, docId) => {
  let rawData;
  let filteredData = [];

  if (docId) {
    // Fetching a single document
    const docRef = doc(db, path, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      rawData = docSnap.data();
      filteredData.push({ ...rawData, id: docId }); // Add ID to the document data
    } else {
      console.log("Document not found:", docId);
      return;
    }
  } else {
    // Fetching a collection
    const collectionRef = collection(db, path);
    const querySnapshot = await getDocs(collectionRef);

    rawData = querySnapshot.docs;
    filteredData = rawData.map((document) => {
      const data = document.data();
      const id = document.id;
      return { ...data, id }; // Add ID to each document data
    });
  }

  method(filteredData);
};
