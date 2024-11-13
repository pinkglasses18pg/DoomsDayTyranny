// functions/src/db.ts

import * as admin from "firebase-admin";
import {initializeApp} from "firebase-admin/app";

initializeApp();
export const db = admin.firestore();
