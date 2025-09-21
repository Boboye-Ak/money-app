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
exports.requireAdmin = exports.requireAuth = void 0;
const jwtServices_1 = require("../services/jwtServices");
const validatorServices_1 = require("../services/validatorServices");
const responses_1 = __importDefault(require("../configs/responses"));
const prisma_1 = __importDefault(require("../configs/prisma"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res
                .status(responses_1.default[400].responseCode)
                .json({ error: responses_1.default[400].noAuthHeader });
        }
        const token = (0, validatorServices_1.extractAuthorizationToken)(authorizationHeader);
        if (!token) {
            return res
                .status(responses_1.default[401].responseCode)
                .json({ error: responses_1.default[401].invalidAuthHeader });
        }
        try {
            const payload = (0, jwtServices_1.verifyAccessToken)(token);
            req.user = payload;
        }
        catch (e) {
            console.log(e);
            return res
                .status(responses_1.default[401].responseCode)
                .json({ message: responses_1.default[401].invalidAccessToken });
        }
        next();
    }
    catch (e) {
        console.log(e);
        return res
            .status(responses_1.default[500].responseCode)
            .json({ error: responses_1.default[500].serverError });
    }
});
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.user;
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: { flags: true },
    });
    if (!user) {
        return res.status(404).json({ message: "User Not found" });
    }
    if (!((_a = user.flags) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        return res
            .status(401)
            .json({ message: "Admin Access is required to access this endpoint" });
    }
    next();
});
exports.requireAdmin = requireAdmin;
