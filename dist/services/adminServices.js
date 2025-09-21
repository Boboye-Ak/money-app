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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockUser = exports.blockUser = exports.adminGetUser = exports.adminGetUsers = void 0;
const prisma_1 = __importDefault(require("../configs/prisma"));
const error_1 = require("../types/error");
const adminGetUsers = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skip = (page - 1) * limit;
        const users = yield prisma_1.default.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                balance: true,
                createdAt: true,
                flags: true,
            },
        });
        return {
            message: "Operation Completed Successfully",
            responseCode: 200,
            users,
        };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Getting Users");
    }
});
exports.adminGetUsers = adminGetUsers;
const adminGetUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                balance: true,
                createdAt: true,
                flags: true,
            },
        });
        if (!user)
            throw new error_1.AppError("User not found", 404);
        return {
            message: "Operation Completed Successfully",
            responseCode: 200,
            user,
        };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Getting User");
    }
});
exports.adminGetUser = adminGetUser;
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.flags.update({
            where: {
                customerId: userId,
            },
            data: {
                isBlocked: true,
            },
        });
        return { message: "Operation Completed Successfully", responseCode: 200 };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Blocking User");
    }
});
exports.blockUser = blockUser;
const unblockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.flags.update({
            where: {
                customerId: userId,
            },
            data: {
                isBlocked: false,
            },
        });
        return { message: "Operation Completed Successfully", responseCode: 200 };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Unblocking User");
    }
});
exports.unblockUser = unblockUser;
