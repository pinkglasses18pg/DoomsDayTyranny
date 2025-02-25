"use strict";
// functions/src/initUser.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUser = initUser;
const db_1 = require("./db");
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
async function initUser(telegramID, username) {
    const userRef = db_1.db.collection("users").doc(telegramID);
    const configRef = db_1.db.collection("config").doc("electronic");
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
    const config = electronicData === null || electronicData === void 0 ? void 0 : electronicData.config;
    if (userDoc.exists) {
        const userData = userDoc.data();
        return {
            status: "updated",
            gameStats: userData.gameStats,
            mapData: userData.mapData,
            config,
            ticks: Math.ceil((Date.now() - userData.lastUpdate) / 100),
        };
    }
    else {
        const newUser = {
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
//# sourceMappingURL=initUser.js.map