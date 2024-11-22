// functions/src/initUser.ts

import {db} from "./db";
import {User} from "./types";

export type ResultInit = {
  status: "created" | "updated" | "error";
  gameStats: string;
  mapData: string;
  config: string | null;
  ticks?: number;
};
/**
 * Initialize a user, updating their login rewards and creating a new user if
 * not already existing.
 *
 * @async
 * @param {string} telegramID - The Telegram ID of the user.
 * @param {string} username - Name of user in the telegram.
 * defaults to null.
 * @return {Promise<ResultInit>} A promise that
 * resolves to an object indicating the status of user initialization.
 */
export async function initUser(
  telegramID: string,
  username?: string
): Promise<ResultInit> {
  const userRef = db.collection("users").doc(telegramID);
  const configRef = db.collection("config").doc("electronic");
  const userDoc = await userRef.get();
  const configDoc = await configRef.get();

  console.log("is initUser.ts is working?");

  if (!configDoc.exists) {
    return {
      status: "error",
      gameStats: "",
      mapData: "",
      config: null,
    };
  }
  const electronicData = configDoc.data();
  const config = electronicData?.config;

  if (userDoc.exists) {
    const userData = userDoc.data() as User;

    return {
      status: "updated",
      gameStats: userData.gameStats,
      mapData: userData.mapData,
      config,
      ticks: Math.ceil((Date.now() - userData.lastUpdate) / 100),
    };
  } else {
    const newUser: User = {
      telegramId: telegramID,
      coins: 200000,
      gameStats: "{\"coin\":200000,\"mines\":" +
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
      mapData: "",
      lastUpdate: Date.now(),
      username: username,
    };

    await userRef.set(newUser);

    return {
      status: "created",
      gameStats: "",
      mapData: "",
      config,
    };
  }
}
