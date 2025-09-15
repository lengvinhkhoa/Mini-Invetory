import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseClients = {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
};

function readConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  } as const;
}

export function getFirebaseClients(): FirebaseClients {
  const cfg = readConfig();
  if (!cfg.apiKey || !cfg.authDomain || !cfg.projectId || !cfg.appId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Firebase client config missing. Set NEXT_PUBLIC_FIREBASE_* envs.");
    }
    return { app: null, auth: null, firestore: null };
  }
  const app = getApps().length ? getApps()[0]! : initializeApp(cfg as any);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}


