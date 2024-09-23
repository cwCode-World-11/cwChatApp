import { storageFirebase } from "../../firebase/firebaseConfig";
import {
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";

const uploadFile = async (pathName, fileName, fileObj) => {
  let uploadSuccess = false;
  if (!fileObj) {
    alert("file doesn't exist!!!");
    return;
  }
  try {
    const storageRef = ref(storageFirebase, `${pathName}/${fileName}`);

    const uploadBytesResumablePannu = uploadBytesResumable(storageRef, fileObj); //process start
    return new Promise((resolve, reject) => {
      uploadBytesResumablePannu.on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("progress file uploading:", progress);
        },
        (error) => {
          console.error("failed during uploading file!:", error);
          reject("failed during uploading file!");
        },
        () => {
          console.log("Upload success");
          uploadSuccess = true;
          resolve(uploadSuccess);
        }
      );
    });
  } catch (error) {
    console.error("file upload pandrathula error:", error);
    alert(error);
  }
};

const getImageUrl = async (pathName, fileName) => {
  try {
    const storageRef = ref(storageFirebase, `${pathName}/${fileName}`);

    const url = await getDownloadURL(storageRef);
    // console.log("url:", url);
    return url;
  } catch (error) {
    console.error("file url get pandrathula error:", error);
    alert(error);
  }
};

const deleteFile = async (pathName, fileName) => {
  try {
    const storageRef = ref(storageFirebase, `${pathName}/${fileName}`);
    const d = await deleteObject(storageRef);
    console.log("FIle deleted successfully!");
    console.log("d:", d);
  } catch (error) {
    console.error("file delete pandrathula error:", error);
    alert(error);
  }
};

export { uploadFile, getImageUrl, deleteFile };
