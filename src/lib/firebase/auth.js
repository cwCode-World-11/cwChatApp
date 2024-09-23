import { authFirebase } from "../../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

const signUpAuthFirebase = async (email, password) => {
  try {
    const u = await createUserWithEmailAndPassword(
      authFirebase,
      email,
      password
    );
    return u;
  } catch (error) {
    console.error("Auth create pandrathula error:", error.message);
    alert(error);
  }
};

const signInAuthFirebase = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(authFirebase, email, password);
  } catch (error) {
    console.error("Auth login pandrathula error:", error.message);
    alert(error);
    return;
  }
};

const signOutAuthFirebase = async () => {
  try {
    return await signOut(authFirebase);
  } catch (error) {
    console.error("Auth signOut pandrathula error:", error.message);
    alert(error);
  }
};

const resetAuthFirebase = async (email) => {
  try {
    return await sendPasswordResetEmail(authFirebase, email);
  } catch (err) {
    console.error("err:", err);
    alert(err);
  }
};

export {
  signUpAuthFirebase,
  signInAuthFirebase,
  signOutAuthFirebase,
  resetAuthFirebase,
};
