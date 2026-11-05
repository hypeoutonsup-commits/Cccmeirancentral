import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmvzdE-d1LjI4hYLHgXhQX7t-6vky96FY",
  authDomain: "ccc-meiran-central-parish.web.app",
  projectId: "ccc-meiran-central-parish",
  storageBucket: "ccc-meiran-central-parish.firebasestorage.app",
  messagingSenderId: "593169000634",
  appId: "1:593169000634:web:0ab8f41392211811fe7a83"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const db = getFirestore(app);
export const storage = getStorage(app);