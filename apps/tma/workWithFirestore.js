// import admin from 'firebase-admin';
import fs from 'fs';

import { initializeApp, applicationDefault, cert  } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter,  } from 'firebase-admin/firestore';
// import { connectFirestoreEmulator } from "firebase/firestore";

const serviceAccountPath = './serviceAccountKey.json'; // Replace with actual path

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK with Firestore
const firebaseConfig = {
  credential : cert(serviceAccount),

  apiKey: "AIzaSyDWIw3PAM2h78SbLEQXDGcO-zhlVx1JBUM",

  authDomain: "telegram-miracle-f1779.firebaseapp.com",

  // databaseURL: "https://telegram-miracle-f1779-default-rtdb.asia-southeast1.firebasedatabase.app",
  // databaseURL: "http://127.0.0.1:9000/?ns=telegram-miracle-f1779",

  projectId: "telegram-miracle-f1779",

  storageBucket: "telegram-miracle-f1779.appspot.com",

  messagingSenderId: "602978729884",

  appId: "1:602978729884:web:e29a3bf3ba02efb62fd259",

  measurementId: "G-PFGL0DE7P8"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// connectFirestoreEmulator(db, 'localhost', 8080);

console.log("DB :: ", db)


/* const configData = [
  {
    "resource": {
      "id": "sand",
      "name": "Sand",
      "image": "assets/sand.png",
      "craftResource": [],
      "craftImage": "assets/sandCraft.png"
    },
    "sellPrice": 1,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 0,
    "store": {
      "updateCapacityPrice": [10, 100, 400, 12000, 360000, 1000000],
      "updateCapacityCount": [1000, 2500, 5000, 15000, 75000, 225000, 600000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [],
      "speedUpgradePrice": [],
      "workerPrice": 30,
      "workerProductivity": 1,
      "maxWorkersStock": 150,
      "produceTime": 4
    }
  },
  {
    "resource": {
      "id": "glass",
      "name": "Glass",
      "image": "assets/glass.png",
      "craftResource": [
        {
          "id": "sand",
          "image": "assets/sand.png",
          "count": 2
        }
      ],
      "craftImage": "assets/glassCraft.png"
    },
    "sellPrice": 4,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 0,
    "store": {
      "updateCapacityPrice": [500, 7500, 112500, 1000000],
      "updateCapacityCount": [2250, 15750, 67500, 157500, 337500],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2],
      "speedUpgradePrice": [100000],
      "workerPrice": 100,
      "workerProductivity": 1,
      "maxWorkersStock": 225,
      "produceTime": 16
    }
  },
  {
    "resource": {
      "id": "sandglass",
      "name": "Sandglass",
      "image": "assets/sandglass.png",
      "craftResource": [
        {
          "id": "glass",
          "image": "assets/glass.png",
          "count": 10
        },
        {
          "id": "sand",
          "image": "assets/sand.png",
          "count": 5
        }
      ],
      "craftImage": "assets/sandglassCraft.png"
    },
    "sellPrice": 150,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 0,
    "store": {
      "updateCapacityPrice": [1000, 3000, 9000, 27000],
      "updateCapacityCount": [600, 2400, 4800, 9600, 19200],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4],
      "speedUpgradePrice": [50000, 400000],
      "workerPrice": 2000,
      "workerProductivity": 1,
      "maxWorkersStock": 120,
      "produceTime": 120
    }
  },
  {
    "resource": {
      "id": "copper",
      "name": "Copper",
      "image": "assets/copper.png",
      "craftResource": [],
      "craftImage": "assets/copperCraft.png"
    },
    "sellPrice": 5,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 10,
    "store": {
		"updateCapacityPrice": [1000, 20000, 400000, 2000000],
		"updateCapacityCount": [24000, 96000, 432000, 720000, 1536000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4, 8],
      "speedUpgradePrice": [2000000, 6000000, 12000000],
      "workerPrice": 2000,
      "workerProductivity": 2,
      "maxWorkersStock": 480,
      "produceTime": 120
    }
  },
  {
    "resource": {
      "id": "tungsten",
      "name": "Tungsten",
      "image": "assets/tungsten.png",
      "craftResource": [
        {
          "id": "copper",
          "image": "assets/copper.png",
          "count": 4
        }
      ],
      "craftImage": "assets/tungstenCraft.png"
    },
    "sellPrice": 32,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 100,
    "store": {
      "updateCapacityPrice": [5000, 50000, 500000, 5000000],
      "updateCapacityCount": [4800, 19200, 76800, 115200, 288000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4],
      "speedUpgradePrice": [10000000, 15000000],
      "workerPrice": 10000,
      "workerProductivity": 1,
      "maxWorkersStock": 240,
      "produceTime": 120
    }
  },
  {
    "resource": {
      "id": "bulb",
      "name": "Bulb",
      "image": "assets/bulb.png",
      "craftResource": [
        {
          "id": "tungsten",
          "image": "assets/tungsten.png",
          "count": 4
        },
		{
          "id": "glass",
          "image": "assets/glass.png",
          "count": 6
        }
      ],
      "craftImage": "assets/bulbCraft.png"
    },
    "sellPrice": 100,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 1000,
    "store": {
      "updateCapacityPrice": [25000, 100000, 400000, 1600000],
      "updateCapacityCount": [3600, 7200, 28800, 57600, 96000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4],
      "speedUpgradePrice": [10000000, 15000000],
      "workerPrice": 20000,
      "workerProductivity": 1,
      "maxWorkersStock": 240,
      "produceTime": 240
    }
  },
  {
    "resource": {
      "id": "pachinko_machine",
      "name": "Pachinko machine",
      "image": "assets/pachinko_machine.png",
      "craftResource": [
        {
          "id": "copper",
          "image": "assets/copper.png",
          "count": 100
        },
        {
          "id": "bulb",
          "image": "assets/bulb.png",
          "count": 5
        },
		{
          "id": "glass",
          "image": "assets/glass.png",
          "count": 100
        }
      ],
      "craftImage": "assets/pachinko_machineCraft.png"
    },
    "sellPrice": 1,
    "sellIsMiriclaCoint": true,
    "unlockPrice": 10000,
    "store": {
      "updateCapacityPrice": [2000000, 5000000],
      "updateCapacityCount": [1200, 4800],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4],
      "speedUpgradePrice": [20000000, 50000000],
      "workerPrice": 50000,
      "workerProductivity": 1,
      "maxWorkersStock": 240,
      "produceTime": 480
    }
  }
];*/


// Function to read config data from Firestore
async function readConfigData() {
  try {
    const configRef = db.collection('config').doc('electronic');
    const docSnapshot = await configRef.get();

    if (docSnapshot.exists) {
      const configData = docSnapshot.data();
      console.log('Data read successfully from Firestore:', configData);
    } else {
      console.log('No data found for config/electronic');
    }
  } catch (error) {
    console.error('Error reading config data:', error);
  }
}

// Function to write config data to Firestore
async function writeConfigData() {
  try {
    // Read config.json file
    const configData = JSON.parse(fs.readFileSync('./config_0710.json', 'utf8'));
    const dataToWrite = { config: configData };

    console.log("this is data: ", dataToWrite);

    const res = await db.collection('config').doc('electronic').set(dataToWrite);

    // for (const resource of configData) {
    //   const configRef = db.collection('config').doc(resource.id); // Use resource.id as document ID
    //   await configRef.set(resource);
    // }

    console.log('Added document with ID: ', res.id);


    console.log('Data written successfully to Firestore');
  } catch (error) {
    console.error('Error writing config data:', error);
  }
}

// Function to write Eventconfig data to Firestore
async function writeEventConfigData() {
  try {
    // Read config.json file
    const configData = JSON.parse(fs.readFileSync('./src/event_config.json', 'utf8'));
    const dataToWrite = { config: configData };

    console.log("this is data: ", dataToWrite);

    const res = await db.collection('config').doc('eventConfig').set(dataToWrite);

    // for (const resource of configData) {
    //   const configRef = db.collection('config').doc(resource.id); // Use resource.id as document ID
    //   await configRef.set(resource);
    // }

    console.log('Added document with ID: ', res.id);


    console.log('Data written successfully to Firestore');
  } catch (error) {
    console.error('Error writing config data:', error);
  }
}


async function readUserData() {
  try {
    const userRef = db.collection('/users').doc('303182449');
    const docSnapshot = await userRef.get();

    if (docSnapshot.exists) {
      const userData = docSnapshot.data();
      console.log('Data read successfully from Firestore:', userData);
    } else {
      console.log('No data found for users');
    }
  } catch (error) {
    console.error('Error reading user data:', error);
  }
}

async function readUserData2() {
    try {
        const userRef = db.collection('users');
        const snapshot = await userRef.get();
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
    } catch (error) {
    console.error('Error reading user data:', error);
  }
}

await writeConfigData();