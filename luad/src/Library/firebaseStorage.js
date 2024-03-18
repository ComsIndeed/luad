import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

export function generateName(fileName, size = undefined) {
  const workingFileName = fileName ? fileName : "untitled";

  return `${workingFileName.replaceAll(" ", "_")}__${v4()}${
    size ? "__?size=" + size : ""
  }.webp`;
}

async function uploadBlobsToFirestoreStorage(blobs, documentTitle = undefined) {
  if (!blobs) {
    return null; // Return null for empty blobs
  }

  const keys = Object.keys(blobs);
  const downloadURLs = {};
  const references = {};

  // Create an array of promises for each upload
  const uploadPromises = keys.map(async (key) => {
    const pathReference = `headerImages/${generateName(documentTitle, key)}`;

    const uploadResult = await uploadBytes(
      ref(storage, pathReference),
      blobs[key]
    );
    const downloadURL = await getDownloadURL(uploadResult.ref);

    // Store download URL and reference
    const referenceName = `${key}Ref`;
    // console.log("REFERENCE NAME: ", referenceName);

    downloadURLs[key] = downloadURL;
    references[referenceName] = uploadResult.ref;

    // console.log(downloadURLs, references);

    return { downloadURL, reference: references[referenceName] }; // Return object with both values
  });

  // Wait for all uploads to finish using Promise.all
  try {
    const uploadResults = await Promise.all(uploadPromises);
    return { ...downloadURLs, ...references }; // Return both objects in a single object
  } catch (error) {
    // Handle errors appropriately, e.g., log the error and throw or return an error object
    console.error("Error uploading blobs to Firestore Storage:", error);
    throw error; // Or return { error: "Failed to upload blobs" }
  }
}

export { uploadBlobsToFirestoreStorage };
