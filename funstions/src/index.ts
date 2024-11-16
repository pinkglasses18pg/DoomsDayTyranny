// functions/src/index.ts

import {auth, returnUsername} from "./auth";
import {db} from "./db";
import {initUser as initUserApi, ResultInit} from "./initUser";
import {save as saveStats} from "./save";
import {onRequest} from "firebase-functions/v2/https";
import {FieldPath} from "firebase-admin/firestore";

/* const allowedOrigins = [
  "https://telegram-miracle-f1779.web.app", // Продакшен
  "http://localhost:3005", // Локальный фронтенд
  "http://127.0.0.1:3005",
  "http://127.0.0.1:5001",
    "miracle.ap.ngrok.io",
];*/


export const getUserById = onRequest({cors: true}, async (
    request,
    response
) => {
  console.log("from getUserById : ", request.body);
  const userId = request.body.data.id as string;

  if (!userId) {
    response.status(400).send({data: {
        success: false,
        message: "Bad Request: No user ID provided"},
    });
    return;
  }

  try {
    const userDoc = await db.collection(
        "users").doc(userId).get();

    if (!userDoc.exists) {
      response.status(404).send({data: {success: false,
          message: "User not found"}});
      return;
    }

    response.status(200).send({data: {success: true, user: userDoc.data()}});
  } catch (error: any) {
    response.status(500).send({data: {success: false,
        message: "Internal Server Error",
        error: error.message},
    });
  }
});

export type InitUserRequest = {
  status: "initUser";
};
const adminUser = ["99281932"];
export type InitUserResponse = ResultInit;
export const initUser = onRequest({cors: true}, async (
    request,
    response
) => {
  const data = request.body.data;
  console.log("data is : ", data);
  const userId = auth(data.auth);
  const username = returnUsername(data.auth);
  console.log("Username is : ", username);
  console.log("UserId is : ", userId);

  if (userId === null) {
    response
        .status(403)
        .send({data: {success: false, message: "Unauthorized"}});
    return;
  }
  const result = await initUserApi(userId, username || undefined);

  response.status(200).send({data: {...result, success: true}});
});

export const save = onRequest({cors: true}, async (
    request,
    response
) => {
  const data = request.body.data;
  const userId = auth(data.auth);
  const gameStats = data.gameStats;


  if (userId === null) {
    response
        .status(403)
        .send({data: {success: false, message: "Unauthorized"}});
    return;
  }
  if (!gameStats) {
    response
        .status(400)
        .send({data: {success: false, message: "Bad Request"}});
  }

  const payload: any = {
    userId,
    gameStats,
  };
  if (data.referredParent) {
    payload.referredParent = data.referredParent;
  }

  const result = await saveStats(payload);

  response.status(200).send({data: {...result, success: true}});
});

export const uploadConfig = onRequest({cors: true},
    async (request, response) => {
      const data = request.body.data;
      const userId = auth(data.auth);
      const config = data.config;

      if (userId === null || !adminUser.includes(userId)) {
        response
            .status(403)
            .send({data: {success: false, message: "Unauthorized"}});
        return;
      }
      if (!config) {
        response.status(400).send({
          data: {success: false, message: "Bad Request: No config provided"},
        });
        return;
      }

      try {
        const configRef = db.collection(
            "config").doc("electronic");
        await configRef.set({config: JSON.parse(config), upload: new Date()});

        response.status(200).send({
          data: {success: true, message: "Config uploaded successfully"},
        });
      } catch (error) {
        response.status(500).send({
          data: {
            success: false,
            message: "Internal Server Error",
            error: error,
          },
        });
      }
    });

interface ReferralWithUsername {
  id: string;
  referredUserId: string;
  username: string;
  isRead: boolean;
}

export const getNewReferrals = onRequest({cors: true}, async (
    request,
    response
) => {
  const data = request.body.data;
  const userId = auth(data.auth);

  console.log("Received userId inside getNewReferrals : ", userId);

  console.log("Received authData inside getNewReferrals :", data.auth);

  if (userId === null) {
    response.status(403).send({data: {success: false,
        message: "Unauthorized"}});
    return;
  }

  try {
    const userRef = db.collection(
        "users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      response.status(404).send({data: {success: false,
          message: "User not found"}});
      return;
    }

    const userData = userDoc.data();
    const referralChildren = userData?.referralChildren || [];

    // Фильтруем рефералов с isRead = false
    const newReferrals = referralChildren.filter(
        (child: { id: string; isRead: boolean }) => !child.isRead
    );

    if (newReferrals.length === 0) {
      response.status(200).send({data: {success: true, newReferrals: []}});
      return;
    }

    // Extract referredUserIds
    const referredUserIds = newReferrals.map((child: {
      id: string;
      isRead: boolean
    }) => child.id);

    // Fetch usernames in batches of 10
    const batchSize = 10;
    const batches: string[][] = [];

    for (let i = 0; i < referredUserIds.length; i += batchSize) {
      batches.push(referredUserIds.slice(i, i + batchSize));
    }

    const referralWithUsernames: ReferralWithUsername[] = [];

    for (const batch of batches) {
      const usersSnapshot = await db.collection(
          "users").where(FieldPath.documentId(), "in", batch).get();
      const userMap: { [key: string]: string } = {};

      usersSnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data()?.username || "Unknown User");
        userMap[doc.id] = doc.data()?.username || "Unknown User";
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

    response.status(200).send({data: {success: true,
        newReferrals: referralWithUsernames},
    });
  } catch (error: any) {
    console.error("Error fetching new referrals:", error);
    response.status(500).send({data: {success: false,
        message: "Internal Server Error",
        error: error.message,
      }});
  }
});

export const markReferralsAsRead = onRequest({cors: true}, async (
    request,
    response
) => {
  const data = request.body.data;
  const userId = auth(data.auth);

  if (userId === null) {
    response.status(403).send({data: {success: false,
        message: "Unauthorized"}});
    return;
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      response.status(404).send({data: {success: false,
          message: "User not found"}});
      return;
    }

    const userData = userDoc.data();
    let referralChildren = userData?.referralChildren || [];

    // Обновляем поле isRead на true для всех непрочитанных рефералов
    referralChildren = referralChildren.map((child: { id: string;
      isRead: boolean
    }) => {
      if (!child.isRead) {
        return {...child, isRead: true};
      }
      return child;
    });

    // Сохраняем обновления в Firestore
    await userRef.update({referralChildren});

    response.status(200).send({data: {success: true,
        message: "Referrals marked as read"}});
  } catch (error: any) {
    console.error("Error updating referrals:", error);
    response.status(500).send({data: {success: false,
        message: "Internal Server Error",
        error: error.message}});
  }
});
