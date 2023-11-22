import { db } from "../config/firebase";
import { collection, getDocs, doc } from "firebase/firestore";

export const importCollection = async (method, path) => {
  const rawData = await getDocs(collection(db, path));
  console.log(rawData)
  const filteredData = rawData.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  }));

  method(filteredData)
}