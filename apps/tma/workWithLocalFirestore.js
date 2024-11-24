import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, collection, doc, setDoc, getDoc } from "firebase/firestore"; // Клиентский SDK



// Initialize Firebase Admin SDK with Firestore
const firebaseConfig = {
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

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Получаем Firestore
const db = getFirestore(app);

// Подключаемся к эмулятору Firestore
connectFirestoreEmulator(db, 'localhost', 8080);

console.log("DB :: ", db)


const configData = [
  {
    "resource": {
      "id": "sand",
      "name": "Sand",
      "image": "assets/sand.png",
      "craftResource": [],
      "craftImage": "assets/sandCraft.png"
    },
    "sellPrice": 0,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 0,
    "itReferalRecurce":false,
    "notManualMining":false,
    "store": {
      "updateCapacityPrice": [100, 1000, 4000, 120000, 3600000, 10000000],
      "updateCapacityCount": [1000, 2500, 5000, 15000, 75000, 225000, 600000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [],
      "speedUpgradePrice": [],
      "workerPrice": 30720,
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
    "sellPrice": 0,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 0,
    "itReferalRecurce":false,
    "notManualMining":false,
    "store": {
      "updateCapacityPrice": [5000, 75000, 1125000, 10000000],
      "updateCapacityCount": [2250, 15750, 67500, 157500, 337500],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2],
      "speedUpgradePrice": [100000],
      "workerPrice": 102400,
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
          "count": 4
        }
      ],
      "craftImage": "assets/sandglassCraft.png"
    },
    "sellPrice": 1536000,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 0,
    "itReferalRecurce":false,
    "notManualMining":false,
    "store": {
      "updateCapacityPrice": [10000, 30000, 90000, 270000, 490000],
      "updateCapacityCount": [600, 2400, 4800, 9600, 19200, 100000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4],
      "speedUpgradePrice": [50000, 400000],
      "workerPrice": 2048000,
      "workerProductivity": 1,
      "maxWorkersStock": 120,
      "produceTime": 16
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
    "sellPrice": 0,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 50000,
    "itReferalRecurce":false,
    "notManualMining":false,
    "store": {
		"updateCapacityPrice": [10000, 200000, 4000000, 20000000],
		"updateCapacityCount": [24000, 96000, 432000, 720000, 1536000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4, 8],
      "speedUpgradePrice": [2000000, 6000000, 12000000],
      "workerPrice": 2048000,
      "workerProductivity": 2,
      "maxWorkersStock": 480,
      "produceTime": 60
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
          "count": 20
        }
      ],
      "craftImage": "assets/tungstenCraft.png"
    },
    "sellPrice": 0,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 100000,
    "itReferalRecurce":false,
    "notManualMining":false,
    "store": {
      "updateCapacityPrice": [50000, 500000, 5000000, 50000000],
      "updateCapacityCount": [4800, 19200, 76800, 115200, 288000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4],
      "speedUpgradePrice": [10000000, 15000000],
      "workerPrice": 10240000,
      "workerProductivity": 1,
      "maxWorkersStock": 240,
      "produceTime": 60
    }
  },
  {
    "resource": {
      "id": "bulb",
      "name": "Bulb",
      "image": "assets/bulb.png",
      "craftResource": [
        {
          "id": "copper",
          "image": "assets/copper.png",
          "count": 40
        }
      ],
      "craftImage": "assets/bulbCraft.png"
    },
    "sellPrice": 0,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 250000,
    "itReferalRecurce":false,
    "notManualMining":false,
    "store": {
      "updateCapacityPrice": [250000, 1000000, 4000000, 16000000],
      "updateCapacityCount": [3600, 7200, 28800, 57600, 96000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4],
      "speedUpgradePrice": [10000000, 15000000],
      "workerPrice": 20480000,
      "workerProductivity": 1,
      "maxWorkersStock": 240,
      "produceTime": 60
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
          "count": 20
        },
        {
          "id": "bulb",
          "image": "assets/bulb.png",
          "count": 1
        },
		{
          "id": "sandglass",
          "image": "assets/sandglass.png",
          "count": 1
        }
      ],
      "craftImage": "assets/pachinko_machineCraft.png"
    },
    "sellPrice": 1,
    "sellIsMiriclaCoint": true,
    "unlockPrice": 1000000,
    "itReferalRecurce":false,
    "notManualMining":false,
    "store": {
      "updateCapacityPrice": [20000000, 50000000],
      "updateCapacityCount": [1200, 4800],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [2, 4],
      "speedUpgradePrice": [20000000, 50000000],
      "workerPrice": 51200000,
      "workerProductivity": 1,
      "maxWorkersStock": 240,
      "produceTime": 60
    }
  },
  {
    "resource": {
      "id": "uranus",
      "name": "Uranus",
      "image": "assets/uranus.png",
      "craftResource": [],
      "craftImage": "assets/uranusCraft.png"
    },
    "sellPrice": 0,
    "sellIsMiriclaCoint": false,
    "unlockPrice": 0,
    "itReferalRecurce":true,
    "notManualMining":true,
    "store": {
      "updateCapacityPrice": [100, 1000, 4000, 120000, 3600000, 10000000],
      "updateCapacityCount": [1000, 2500, 5000, 15000, 75000, 225000, 600000],
      "priceIsMiracleCoin": false
    },
    "passive": {
      "toolPriceIsMiracleCoin": false,
      "workerPriceIsMiracleCoin": false,
      "speedProductivity": [],
      "speedUpgradePrice": [],
      "workerPrice": 30720,
      "workerProductivity": 1,
      "maxWorkersStock": 150,
      "produceTime": 4
    }
  }
];


// Function to read config data from Firestore
async function readConfigData() {
  try {
    //const configRef = db.collection('config').doc('electronic');
    //const docSnapshot = await configRef.get();
    const res = await getDoc(doc(db, 'config', 'electronic'));

    if (res.exists) {
      const configData = res.data();
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
    // const configData = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    const dataToWrite = { config: configData };

    console.log("this is data: ", dataToWrite);

    // const res = await db.collection('config').doc('electronic').set(dataToWrite);
    const res = await setDoc(doc(db, 'config', 'electronic'), dataToWrite);

    // for (const resource of configData) {
    //   const configRef = db.collection('config').doc(resource.id); // Use resource.id as document ID
    //   await configRef.set(resource);
    // }

    console.log('Added document with ID: ', res);


    console.log('Data written successfully to Firestore');
  } catch (error) {
    console.error('Error writing config data:', error);
  }
}


async function readUserData() {
  try {
    // const userRef = db.collection('users').doc('303182449');
    // const docSnapshot = await userRef.get();

    const docSnapshot = await getDoc(doc(db, 'users', '303182449'));

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

async function readAllUsersData() {
    try {
        //const userRef = db.collection('users');
        //const snapshot = await userRef.get();
      const snapshot = await getDoc(doc(db, 'users'));


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

async function createUserData() {
  try {
    // const userRef = db.collection('users').doc('303182449');
    // const docSnapshot = await userRef.get();

    const userdata = {
      "telegramId": "66298544",
      "coins": 0,
      "gameStats" : "",
      "username" : "Vova"
    }




    const docSnapshot = await setDoc(doc(db, 'users', '66298544'), userdata);

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

async function createForTestParentReferral() {
  try {
    // const userRef = db.collection('users').doc('303182449');
    // const docSnapshot = await userRef.get();

    const userdata = {
      "telegramId": "303182449",
      "coins": 200000,
      "gameStats" : "{\"coin\":200000,\"mines\":" +
          "{\"sand\":{\"id\":\"sand\",\"store\":" +
          "{\"count\":500},\"maxStore\":1000," +
          "\"levelStore\":0,\"usagePerMinute\":0," +
          "\"passive\":" +
          "{\"currentSpeedProductiviy\":1,\"workerCount\":0," +
          "\"fabricGrade\":0,\"currentProduceTime\":4," +
          "\"progress\":0,\"craftPerMinute\":0}}," +
          "\"glass\":{\"id\":\"glass\",\"store\":{\"count\":2000}," +
          "\"maxStore\":2250,\"levelStore\":0,\"usagePerMinute\":0," +
          "\"passive\":{\"currentSpeedProductiviy\":1," +
          "\"workerCount\":0,\"fabricGrade\":0,\"currentProduceTime\":16," +
          "\"progress\":0,\"craftPerMinute\":0}}," +
          "\"sandglass\":{\"id\":\"sandglass\",\"store\":{\"count\":0}," +
          "\"maxStore\":600,\"levelStore\":0," +
          "\"usagePerMinute\":0,\"passive\":{\"currentSpeedProductiviy\":1," +
          "\"workerCount\":0,\"fabricGrade\":0," +
          "\"currentProduceTime\":16,\"progress\":0,\"craftPerMinute\":0}}}," +
          "\"mCoin\":0}",
      "username" : "Bogdan_Galay",
      "referralChildren": [{"id": "66298544", "isRead": false}, {"id": "12345678", "isRead": true}],
    }




    const docSnapshot = await setDoc(doc(db, 'users', '303182449'), userdata);

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

await writeConfigData();

//await readAllUsersData();

await createUserData();

await createForTestParentReferral();