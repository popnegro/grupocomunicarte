import { initializeApp, getApps, getApp } from "firebase/app";
import firebaseConfig from "../../firebase-applet-config.json";

export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
