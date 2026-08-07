import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const dbInstanceId = (firebaseConfig as any).firestoreDatabaseId;
export const db = dbInstanceId ? getFirestore(app, dbInstanceId) : getFirestore(app);
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope("https://www.googleapis.com/auth/presentations");
googleAuthProvider.addScope("https://www.googleapis.com/auth/drive");

export { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider };
