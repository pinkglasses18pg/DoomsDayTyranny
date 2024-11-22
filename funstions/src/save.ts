// functions/src/save.ts

import {db} from "./db";

export type ResultInit = {
  status: string;
};
/**
 * Initialize a user, updating their login rewards and creating a new user if
 * not already existing.
 *
 * @async
 * @param {Object} payload - The payload containing user information.
 * @param {string} payload.userId - The Telegram ID of the user.
 * @param {string} payload.gameStats - The game statistics of the user.
 * @param {string} [payload.referredParent] - (Optional) The referrer's ID.
 * @return {Promise<{ status: string }>} A promise that
 * resolves to an object indicating the status of user initialization.
 */
export async function save(
  payload: { userId: string;
    gameStats: string;
    mapData: string,
    referredParent?: string }
): Promise<{ status: string }> {
  const {userId, gameStats, mapData, referredParent} = payload;
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  const updateData: any = {
    gameStats,
    mapData,
    lastUpdate: Date.now(),
  };

  if (referredParent) {
    updateData.referredParent = referredParent;
  }

  if (userDoc.exists) {
    await userRef.update(updateData);

    // Обновляем документ родителя-реферрала
    if (referredParent) {
      const parentUserRef = db.collection("users").doc(referredParent);
      const parentUserDoc = await parentUserRef.get();

      if (parentUserDoc.exists) {
        const parentData = parentUserDoc.data();
        let referralChildren = parentData?.referralChildren || [];

        // Убедимся, что referralChildren является массивом
        if (!Array.isArray(referralChildren)) {
          referralChildren = [];
        }

        // Проверяем, есть ли уже ребенок с таким ID
        const existingChildIndex = referralChildren.findIndex(
          (child: { id: string; isRead: boolean }) => child.id === userId
        );

        if (existingChildIndex === -1) {
          // Добавляем нового ребенка
          referralChildren.push({id: userId, isRead: false});
        } else {
          console.log("Такой ребенок-реферрал уже есть");
        }

        await parentUserRef.update({referralChildren});
      } else {
        console.error(`Документ родителя с ID ${referredParent} не найден.`);
      }
    }

    return {status: "updated"};
  } else {
    return {
      status: "user not found",
    };
  }
}

