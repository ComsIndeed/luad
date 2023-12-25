import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../Library/firebase";
import { v4 as UUID } from "uuid";

// Upload thumbnail
export async function uploadThumbnail(
  image,
  name = undefined,
  isVerbose = false
) {
  const func = async (passedFileName) => {
    const uploadPromise = uploadBytes(
      ref(storage, `thumbnails/${passedFileName}`),
      image
    );
    const downloadPromise = uploadPromise.then((snapshot) =>
      getDownloadURL(snapshot.ref)
    );
    return await downloadPromise;
  };

  if (name) {
    const fileName = name + "_" + UUID() + ".png";

    const thumbnailReference = ref(storage, `thumbnails/${fileName}`).fullPath;
    console.log(thumbnailReference);

    const thumbnailDownloadURL = await func(fileName);
    return { thumbnailDownloadURL, thumbnailReference };
  } else {
    const fileName = UUID() + ".png";

    const thumbnailReference = ref(storage, `thumbnails/${fileName}`).fullPath;
    console.log(thumbnailReference);

    const thumbnailDownloadURL = await func(fileName);
    return { thumbnailDownloadURL, thumbnailReference };
  }
}
