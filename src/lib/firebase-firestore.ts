import { getFirestore } from "firebase/firestore";
import { app } from "./firebase-app";
import firebaseConfig from "../../firebase-applet-config.json";

const dbInstanceId = (firebaseConfig as any).firestoreDatabaseId;

export const db = dbInstanceId
  ? getFirestore(app, dbInstanceId)
  : getFirestore(app);
