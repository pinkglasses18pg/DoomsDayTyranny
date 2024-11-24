import admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';

const serviceAccountPath = './serviceAccountKey.json'; // Replace with actual path

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// console.log("serviceAccount : ", serviceAccount)

const firebaseConfig = {

  credential : admin.credential.cert(serviceAccount),

  apiKey: "AIzaSyDWIw3PAM2h78SbLEQXDGcO-zhlVx1JBUM",

  authDomain: "telegram-miracle-f1779.firebaseapp.com",

  databaseURL: "https://telegram-miracle-f1779-default-rtdb.asia-southeast1.firebasedatabase.app",
  // databaseURL: "http://127.0.0.1:9000/?ns=telegram-miracle-f1779",

  projectId: "telegram-miracle-f1779",

  storageBucket: "telegram-miracle-f1779.appspot.com",

  messagingSenderId: "602978729884",

  appId: "1:602978729884:web:e29a3bf3ba02efb62fd259",

  measurementId: "G-PFGL0DE7P8"

};


// Initialize Firebase Admin SDK
admin.initializeApp(firebaseConfig);

const db = getDatabase();

// Function to read config.json and write/update data
async function writeConfigData() {
  try {
    // Read config.json file
    const configData = JSON.parse(fs.readFileSync('./config_0710.json', 'utf8'));

    console.log("this is data: ", configData);

    // Write or update data in the Realtime Database
    await db.ref('config/electronic').set(configData);

    console.log('Data written successfully to Realtime Database.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// read from db
async function readConfigData() {
  try {
    // Read data from the Realtime Database
    const dataSnapshot = await db.ref('config/electronic').once("value");

    // Check if data exists
    if (dataSnapshot.exists) {
      const configData = dataSnapshot.val();
      console.log('Data read successfully from Realtime Database:', configData);
    } else {
      console.log('No data found at config/electronic');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


async function writeEventConfigData() {
  try {
    // Read config.json file
    const configData = JSON.parse(fs.readFileSync('./src/event_config.json', 'utf8'));

    console.log("this is data: ", configData);

    // Write or update data in the Realtime Database
    const answer = await db.ref('config/eventConfig').set(configData);

    console.log("answer from BD: ", answer);

    console.log('Data written successfully to Realtime Database.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function to write/update data
writeConfigData();