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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshAccessToken = exports.login = exports.getUserById = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../configs/prisma"));
const jwtServices_1 = require("./jwtServices");
const ms_1 = __importDefault(require("ms"));
const error_1 = require("../types/error");
const registerUser = (email, firstName, lastName, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existingUser)
            throw new error_1.AppError("User Already Exists", 409);
        const user = yield prisma_1.default.user.create({
            data: {
                email: email.toLowerCase(),
                firstname: firstName.toUpperCase(),
                lastname: lastName.toUpperCase(),
                hashedPassword,
                flags: {
                    create: {},
                },
            },
            include: {
                flags: true,
            },
        });
        return { message: "Operation Completed Successfully", responseCode: 200 };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Signing Up");
    }
});
exports.registerUser = registerUser;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            include: { flags: true },
        });
        if (!user)
            throw new error_1.AppError("User Not Found", 404);
        const { hashedPassword } = user, safeUser = __rest(user, ["hashedPassword"]);
        return {
            responseCode: 200,
            message: "Operation Completed Successfully",
            user: safeUser,
        };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Getting User");
    }
});
exports.getUserById = getUserById;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { email: email.toLowerCase() },
            include: { flags: true },
        });
        if (!user)
            throw new error_1.AppError("Invalid Credentials", 401);
        const match = yield bcrypt_1.default.compare(password, user.hashedPassword);
        if (!match)
            throw new error_1.AppError("Invalid Credentials", 401);
        const accessToken = yield (0, jwtServices_1.signAccessToken)({
            userId: user.id,
            email: user.email,
        });
        const refreshToken = yield (0, jwtServices_1.signRefreshToken)({
            userId: user.id,
            email: user.email,
        });
        const refreshTokenExpiresIn = process.env
            .REFRESH_TOKEN_EXPIRES_IN;
        yield prisma_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + (0, ms_1.default)(refreshTokenExpiresIn)),
            },
        });
        return {
            responseCode: 200,
            message: "Operation Completed Successfully",
            tokens: { accessToken, refreshToken },
        };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Signing Up");
    }
});
exports.login = login;
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storedToken = yield prisma_1.default.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!storedToken)
            throw new error_1.AppError("Invalid refresh token", 401);
        const user = yield prisma_1.default.user.findUnique({
            where: { id: storedToken === null || storedToken === void 0 ? void 0 : storedToken.userId },
            include: { flags: true },
        });
        if (!user)
            throw new error_1.AppError("User not found", 404);
        yield (0, jwtServices_1.verifyRefreshToken)(refreshToken);
        const accessToken = (0, jwtServices_1.signAccessToken)({
            userId: storedToken.userId,
            email: user.email,
        });
        return {
            responseCode: 200,
            message: "Operation Completed Successfully",
            accessToken,
        };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Refreshing Token");
    }
});
exports.refreshAccessToken = refreshAccessToken;
const logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.refreshToken.delete({ where: { token: refreshToken } });
        return { message: "Operation Completed Successfully", responseCode: 200 };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Logging out");
    }
});
exports.logout = logout;
