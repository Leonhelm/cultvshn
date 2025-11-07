import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
});

const db = getFirestore(app);

export const readOffset = async () => {
  const ref = doc(db, "tg", "updates");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Документ не найден");
  }

  const { offset } = snap.data();

  return offset;
};

export const updateOffset = async (offset) => {
  const ref = doc(db, "tg", "updates");

  await updateDoc(ref, { offset });
};

export const incrementOffset = async (delta) => {
  const ref = doc(db, "tg", "updates");

  await updateDoc(ref, { offset: increment(delta) });
};
