"use strict";
// functions/src/auth.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnUsername = exports.auth = void 0;
const init_data_node_1 = require("@tma.js/init-data-node");
const logger = __importStar(require("firebase-functions/logger"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const isDev = process.env.NODE_ENV === "development";
const telegramToken = (isDev ? process.env.LOCAL_TELEGRAM_TOKEN : process.env.TELEGRAM_TOKEN) || "";
const auth = (authorization) => {
    var _a;
    const [authType, authData = ""] = (authorization || "").split(" ");
    if (authType !== "tma" || !authData) {
        return null;
    }
    try {
        (0, init_data_node_1.validate)(authData, telegramToken, { expiresIn: 3600 });
    }
    catch (error) {
        logger.error(error);
        return null;
    }
    const data = (0, init_data_node_1.parse)(authData);
    if (((_a = data.user) === null || _a === void 0 ? void 0 : _a.id) === undefined) {
        return null;
    }
    return data.user.id.toString();
};
exports.auth = auth;
const returnUsername = (authorization) => {
    var _a;
    const [authType, authData = ""] = (authorization || "").split(" ");
    if (authType !== "tma" || !authData) {
        return null;
    }
    try {
        (0, init_data_node_1.validate)(authData, telegramToken, { expiresIn: 3600 });
    }
    catch (error) {
        logger.error(error);
        return null;
    }
    const data = (0, init_data_node_1.parse)(authData);
    if (((_a = data.user) === null || _a === void 0 ? void 0 : _a.username) === undefined) {
        return null;
    }
    return data.user.username.toString();
};
exports.returnUsername = returnUsername;
//# sourceMappingURL=auth.js.map