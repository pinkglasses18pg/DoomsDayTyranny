
// import { initializeApp } from 'firebase/app';
// import { getFirestore} from 'firebase/firestore';
// import { collection, getDocs } from "firebase/firestore";

import firebase from 'firebase/app';
import 'firebase/firestore'


// import fs from 'fs';

// const serviceAccountPath = './serviceAccountKey.json'; // Replace with actual path

// const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// console.log("serviceAccount : ", serviceAccount)

const firebaseConfig = {

  // credential : admin.credential.cert(serviceAccount),

  apiKey: "AIzaSyDWIw3PAM2h78SbLEQXDGcO-zhlVx1JBUM",

  authDomain: "telegram-miracle-f1779.firebaseapp.com",

  // databaseURL: "https://telegram-miracle-f1779-default-rtdb.asia-southeast1.firebasedatabase.app",
  databaseURL: "http://127.0.0.1:9000/?ns=telegram-miracle-f1779",

  projectId: "telegram-miracle-f1779",

  storageBucket: "telegram-miracle-f1779.appspot.com",

  messagingSenderId: "602978729884",

  appId: "1:602978729884:web:e29a3bf3ba02efb62fd259",

  measurementId: "G-PFGL0DE7P8"

};

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore();

// const querySnapshot = await getDocs(collection(db, "users"));
// querySnapshot.forEach((doc) => {
//  console.log(`${doc.id} => ${doc.data()}`);
// });

const returned = firestore.collection('users');
console.log("returned : ", returned);