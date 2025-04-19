import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, browserLocalPersistence, browserSessionPersistence, setPersistence } from "firebase/auth";
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

console.log("[Firebase] Initializing Firebase with config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey
});

// Initialize Firebase
let app: FirebaseApp;
try {
  if (getApps().length) {
    console.log("[Firebase] Using existing Firebase app");
    app = getApp();
  } else {
    console.log("[Firebase] Creating new Firebase app");
    app = initializeApp(firebaseConfig);
  }
} catch (error: any) {
  console.error("[Firebase] Error initializing Firebase:", {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
  throw error;
}

// Initialize services
console.log("[Firebase] Initializing Firebase services");
const auth = getAuth(app);

// Set persistence before doing anything else with auth
console.log("[Firebase] Setting up auth persistence...");
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("[Firebase] Auth persistence set to local successfully");
  })
  .catch((error) => {
    console.error("[Firebase] Error setting persistence:", error);
  });

const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  console.log("[Firebase] Checking analytics support");
  isSupported().then(yes => {
    if (yes) {
      console.log("[Firebase] Analytics supported, initializing");
      analytics = getAnalytics(app);
    } else {
      console.log("[Firebase] Analytics not supported in this environment");
    }
  }).catch(error => {
    console.error("[Firebase] Error checking analytics support:", error);
  });
}

// Check current auth state
auth.onAuthStateChanged((user) => {
  console.log("[Firebase] Initial auth state:", {
    isAuthenticated: !!user,
    userId: user?.uid
  });
});

export { app, auth, db, storage, analytics };
