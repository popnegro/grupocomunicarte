import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase-auth";

export const googleSlidesAuthProvider = new GoogleAuthProvider();

googleSlidesAuthProvider.addScope(
  "https://www.googleapis.com/auth/presentations",
);

googleSlidesAuthProvider.addScope(
  "https://www.googleapis.com/auth/drive",
);

googleSlidesAuthProvider.setCustomParameters({
  prompt: "select_account",
});

export { GoogleAuthProvider, signInWithPopup, auth };
