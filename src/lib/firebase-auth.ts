import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { app } from "./firebase-app";

export const auth = getAuth(app);

export const googleAuthProvider = new GoogleAuthProvider();

googleAuthProvider.setCustomParameters({
  prompt: "select_account",
});

export {
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
};
