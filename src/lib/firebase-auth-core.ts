import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  getRedirectResult,
  signInWithPopup,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { app } from "./firebase-app";

export const auth = getAuth(app);

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: "select_account",
});

export const googleSlidesAuthProvider = new GoogleAuthProvider();
googleSlidesAuthProvider.addScope("https://www.googleapis.com/auth/presentations");
googleSlidesAuthProvider.addScope("https://www.googleapis.com/auth/drive");
googleSlidesAuthProvider.setCustomParameters({
  prompt: "select_account",
});

export {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  getRedirectResult,
  signInWithPopup,
  browserPopupRedirectResolver,
};
