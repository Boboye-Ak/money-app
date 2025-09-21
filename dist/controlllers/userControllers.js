"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout_post = exports.refreshToken_post = exports.user_get = exports.login_post = exports.signup_post = void 0;
const userServices_1 = require("../services/userServices");
const signup_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName, password } = req === null || req === void 0 ? void 0 : req.body;
    const result = yield (0, userServices_1.registerUser)(email, firstName, lastName, password);
    return res.status(result.responseCode).json({ message: result.message });
});
exports.signup_post = signup_post;
const login_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req === null || req === void 0 ? void 0 : req.body;
    const result = yield (0, userServices_1.login)(email, password);
    return res
        .status(result.responseCode)
        .json({ message: result.message, tokens: result.tokens });
});
exports.login_post = login_post;
const user_get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: senderEmail, userId } = req.user;
    const result = yield (0, userServices_1.getUserById)(userId);
    return res
        .status(result.responseCode)
        .json({ message: result.message, data: result === null || result === void 0 ? void 0 : result.user });
});
exports.user_get = user_get;
const refreshToken_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req === null || req === void 0 ? void 0 : req.body;
    const result = yield (0, userServices_1.refreshAccessToken)(refreshToken);
    return res
        .status(result.responseCode)
        .json({ message: result.message, accessToken: result.accessToken });
});
exports.refreshToken_post = refreshToken_post;
const logout_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req === null || req === void 0 ? void 0 : req.body;
    const result = yield (0, userServices_1.logout)(refreshToken);
    return res.status(result === null || result === void 0 ? void 0 : result.responseCode).json({ message: result === null || result === void 0 ? void 0 : result.message });
});
exports.logout_post = logout_post;
