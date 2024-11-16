// apps/tma/src/store/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

if (import.meta.env.MODE === "development") {
  const functions = getFunctions(getApp());
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  console.log("Подключено к эмулятору функций Firebase на localhost:5001");
}
