"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLoginError = exports.handleSignupError = exports.duplicateRecordCheck = void 0;
const responses_1 = __importDefault(require("../configs/responses"));
const prisma_1 = require("../generated/prisma");
const duplicateRecordCheck = (e) => {
    var _a;
    if (e instanceof prisma_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return { isDuplicateRecord: true, field: (_a = e.meta) === null || _a === void 0 ? void 0 : _a.target };
    }
    else {
        return { isDuplicateRecord: false, field: null };
    }
};
exports.duplicateRecordCheck = duplicateRecordCheck;
const handleSignupError = (e) => {
    console.log(e);
    if ((0, exports.duplicateRecordCheck)(e).isDuplicateRecord) {
        return {
            code: responses_1.default[409].responseCode,
            message: responses_1.default[409].duplicateEmail,
        };
    }
    else {
        return {
            code: responses_1.default[500].responseCode,
            message: responses_1.default[500].serverError,
        };
    }
};
exports.handleSignupError = handleSignupError;
const handleLoginError = (e) => {
    console.log(e);
    if (e instanceof Error) {
        console.error("Error message:", e.message);
        return { code: responses_1.default[401].responseCode, message: e.message };
    }
    else {
        return {
            code: responses_1.default[500].responseCode,
            message: responses_1.default[500].serverError,
        };
    }
};
exports.handleLoginError = handleLoginError;
