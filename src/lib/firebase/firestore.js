import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestoreFirebase } from "../../firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

const createFirestore = async (collectionPathName, dataObj, docId) => {
  try {
    const uuid = docId || uuidv4();
    const collDocRef = doc(firestoreFirebase, collectionPathName, uuid);
    // const subCollDocRef = doc(collDocRef, "subCollectionName", uuidv4());
    // await setDoc(subCollDocRef, dataObj);
    await setDoc(collDocRef, dataObj);
  } catch (error) {
    console.error("firestore write pandrathula error:", error.message);
    alert(error);
  }
};

const readFirestore = async (collectionPathName, docId) => {
  let collRef;
  const data = [];
  try {
    if (docId) {
      collRef = doc(firestoreFirebase, collectionPathName, docId);
      const querySnapShot = await getDoc(collRef);
      if (querySnapShot.exists()) {
        data.push({ docId: querySnapShot.id, ...querySnapShot.data() });
      } else {
        alert("There is no such document or data!!!");
      }
    } else {
      collRef = collection(firestoreFirebase, collectionPathName);
      const querySnapShot = await getDocs(collRef);
      querySnapShot.forEach((doc) =>
        data.push({ docId: doc.id, ...doc.data() })
      );
    }
    return data;
  } catch (error) {
    console.error("firestore read pandrathula error:", error.message);
    alert(error);
  }
};

const updateFirestore = async (collectionPathName, docId, dataObj) => {
  try {
    const collDocRef = doc(firestoreFirebase, collectionPathName, docId);
    await updateDoc(collDocRef, dataObj);
  } catch (error) {
    console.error("firestore update pandrathula error:", error.message);
    alert(error);
  }
};

const deleteFirestore = async (collectionPathName, docId) => {
  try {
    const collDocRef = doc(firestoreFirebase, collectionPathName, docId);
    await deleteDoc(collDocRef);
  } catch (error) {
    console.error("firestore delete pandrathula error:", error.message);
    alert(error);
  }
};

export { createFirestore, readFirestore, updateFirestore, deleteFirestore };
