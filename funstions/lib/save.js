"use strict";
// functions/src/save.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = save;
const db_1 = require("./db");
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
async function save(payload) {
    const { userId, gameStats, mapData, referredParent } = payload;
    const userRef = db_1.db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const updateData = {
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
            const parentUserRef = db_1.db.collection("users").doc(referredParent);
            const parentUserDoc = await parentUserRef.get();
            if (parentUserDoc.exists) {
                const parentData = parentUserDoc.data();
                let referralChildren = (parentData === null || parentData === void 0 ? void 0 : parentData.referralChildren) || [];
                // Убедимся, что referralChildren является массивом
                if (!Array.isArray(referralChildren)) {
                    referralChildren = [];
                }
                // Проверяем, есть ли уже ребенок с таким ID
                const existingChildIndex = referralChildren.findIndex((child) => child.id === userId);
                if (existingChildIndex === -1) {
                    // Добавляем нового ребенка
                    referralChildren.push({ id: userId, isRead: false });
                }
                else {
                    console.log("Такой ребенок-реферрал уже есть");
                }
                await parentUserRef.update({ referralChildren });
            }
            else {
                console.error(`Документ родителя с ID ${referredParent} не найден.`);
            }
        }
        return { status: "updated" };
    }
    else {
        return {
            status: "user not found",
        };
    }
}
//# sourceMappingURL=save.js.map