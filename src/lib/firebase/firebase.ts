import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBBeSO93AHyyU-ilypV4ca92n9fLRL1iug",
  authDomain: "creator-compass-4574f.firebaseapp.com",
  projectId: "creator-compass-4574f",
  storageBucket: "creator-compass-4574f.firebasestorage.app",
  messagingSenderId: "957011787700",
  appId: "1:957011787700:web:95deb1750568100784bce1",
  measurementId: "G-E7KVKS48QJ"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, auth, db, storage, analytics };
