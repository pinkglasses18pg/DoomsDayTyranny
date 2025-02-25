"use strict";
// functions/src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.markReferralsAsRead = exports.getNewReferrals = exports.uploadConfig = exports.save = exports.initUser = exports.getUserById = void 0;
const auth_1 = require("./auth");
const db_1 = require("./db");
const initUser_1 = require("./initUser");
const save_1 = require("./save");
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
exports.getUserById = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    console.log("from getUserById : ", request.body);
    const userId = request.body.data.id;
    if (!userId) {
        response.status(400).send({ data: {
                success: false,
                message: "Bad Request: No user ID provided"
            },
        });
        return;
    }
    try {
        const userDoc = await db_1.db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            response.status(404).send({ data: { success: false,
                    message: "User not found" } });
            return;
        }
        response.status(200).send({ data: { success: true, user: userDoc.data() } });
    }
    catch (error) {
        response.status(500).send({ data: { success: false,
                message: "Internal Server Error",
                error: error.message },
        });
    }
});
const adminUser = ["99281932"];
exports.initUser = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    const data = request.body.data;
    console.log("data is : ", data);
    const userId = (0, auth_1.auth)(data.auth);
    const username = (0, auth_1.returnUsername)(data.auth);
    console.log("Username is : ", username);
    console.log("UserId is : ", userId);
    if (userId === null) {
        response
            .status(403)
            .send({ data: { success: false, message: "Unauthorized" } });
        return;
    }
    const result = await (0, initUser_1.initUser)(userId, username || undefined);
    response.status(200).send({ data: Object.assign(Object.assign({}, result), { success: true }) });
});
exports.save = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    const data = request.body.data;
    const userId = (0, auth_1.auth)(data.auth);
    const gameStats = data.gameStats;
    const mapData = data.mapData;
    if (userId === null) {
        response
            .status(403)
            .send({ data: { success: false, message: "Unauthorized" } });
        return;
    }
    if (!gameStats || !mapData) {
        response
            .status(400)
            .send({ data: { success: false, message: "Bad Request" } });
    }
    const payload = {
        userId,
        gameStats,
        mapData,
    };
    if (data.referredParent) {
        payload.referredParent = data.referredParent;
    }
    const result = await (0, save_1.save)(payload);
    response.status(200).send({ data: Object.assign(Object.assign({}, result), { success: true }) });
});
exports.uploadConfig = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    const data = request.body.data;
    const userId = (0, auth_1.auth)(data.auth);
    const config = data.config;
    if (userId === null || !adminUser.includes(userId)) {
        response
            .status(403)
            .send({ data: { success: false, message: "Unauthorized" } });
        return;
    }
    if (!config) {
        response.status(400).send({
            data: { success: false, message: "Bad Request: No config provided" },
        });
        return;
    }
    try {
        const configRef = db_1.db.collection("config").doc("electronic");
        await configRef.set({ config: JSON.parse(config), upload: new Date() });
        response.status(200).send({
            data: { success: true, message: "Config uploaded successfully" },
        });
    }
    catch (error) {
        response.status(500).send({
            data: {
                success: false,
                message: "Internal Server Error",
                error: error,
            },
        });
    }
});
exports.getNewReferrals = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    const data = request.body.data;
    const userId = (0, auth_1.auth)(data.auth);
    console.log("Received userId inside getNewReferrals : ", userId);
    console.log("Received authData inside getNewReferrals :", data.auth);
    if (userId === null) {
        response.status(403).send({ data: { success: false,
                message: "Unauthorized" } });
        return;
    }
    try {
        const userRef = db_1.db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            response.status(404).send({ data: { success: false,
                    message: "User not found" } });
            return;
        }
        const userData = userDoc.data();
        const referralChildren = (userData === null || userData === void 0 ? void 0 : userData.referralChildren) || [];
        // Фильтруем рефералов с isRead = false
        const newReferrals = referralChildren.filter((child) => !child.isRead);
        if (newReferrals.length === 0) {
            response.status(200).send({ data: { success: true, newReferrals: [] } });
            return;
        }
        // Extract referredUserIds
        const referredUserIds = newReferrals.map((child) => child.id);
        // Fetch usernames in batches of 10
        const batchSize = 10;
        const batches = [];
        for (let i = 0; i < referredUserIds.length; i += batchSize) {
            batches.push(referredUserIds.slice(i, i + batchSize));
        }
        const referralWithUsernames = [];
        for (const batch of batches) {
            const usersSnapshot = await db_1.db.collection("users").where(firestore_1.FieldPath.documentId(), "in", batch).get();
            const userMap = {};
            usersSnapshot.forEach((doc) => {
                var _a, _b;
                console.log(doc.id, "=>", ((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.username) || "Unknown User");
                userMap[doc.id] = ((_b = doc.data()) === null || _b === void 0 ? void 0 : _b.username) || "Unknown User";
            });
            batch.forEach((id) => {
                referralWithUsernames.push({
                    id,
                    referredUserId: id,
                    username: userMap[id] || "Unknown User",
                    isRead: false,
                });
            });
        }
        console.log("newReferrals from index.ts : ", referralWithUsernames);
        response.status(200).send({ data: { success: true,
                newReferrals: referralWithUsernames },
        });
    }
    catch (error) {
        console.error("Error fetching new referrals:", error);
        response.status(500).send({ data: { success: false,
                message: "Internal Server Error",
                error: error.message,
            } });
    }
});
exports.markReferralsAsRead = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    const data = request.body.data;
    const userId = (0, auth_1.auth)(data.auth);
    if (userId === null) {
        response.status(403).send({ data: { success: false,
                message: "Unauthorized" } });
        return;
    }
    try {
        const userRef = db_1.db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            response.status(404).send({ data: { success: false,
                    message: "User not found" } });
            return;
        }
        const userData = userDoc.data();
        let referralChildren = (userData === null || userData === void 0 ? void 0 : userData.referralChildren) || [];
        // Обновляем поле isRead на true для всех непрочитанных рефералов
        referralChildren = referralChildren.map((child) => {
            if (!child.isRead) {
                return Object.assign(Object.assign({}, child), { isRead: true });
            }
            return child;
        });
        // Сохраняем обновления в Firestore
        await userRef.update({ referralChildren });
        response.status(200).send({ data: { success: true,
                message: "Referrals marked as read" } });
    }
    catch (error) {
        console.error("Error updating referrals:", error);
        response.status(500).send({ data: { success: false,
                message: "Internal Server Error",
                error: error.message } });
    }
});
//# sourceMappingURL=index.js.map