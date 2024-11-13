// functions/src/initUser.ts

import {db} from "./db";
import {User} from "./types";

export type ResultInit = {
  status: "created" | "updated" | "error";
  gameStats: string;
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
      config,
      ticks: Math.ceil((Date.now() - userData.lastUpdate) / 100),
    };
  } else {
    const newUser: User = {
      telegramId: telegramID,
      coins: 0,
      gameStats: "",
      lastUpdate: Date.now(),
      username: username,
    };

    await userRef.set(newUser);

    return {
      status: "created",
      gameStats: "",
      config,
    };
  }
}
