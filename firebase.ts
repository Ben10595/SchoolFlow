
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3ovy1aT8cBUan1v3DhQk8Dtz7VJWqMSI",
  authDomain: "schoolflow-2e596.firebaseapp.com",
  projectId: "schoolflow-2e596",
  storageBucket: "schoolflow-2e596.firebasestorage.app",
  messagingSenderId: "958597496918",
  appId: "1:958597496918:web:09b627de75633a5c927bf7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
