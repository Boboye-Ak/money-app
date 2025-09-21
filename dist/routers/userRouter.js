"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controlllers/userControllers");
const userMiddleware_1 = require("../middleware/userMiddleware");
const validatorServices_1 = require("../services/validatorServices");
const validateRequest_1 = require("../middleware/validateRequest");
const authRouter = express_1.default.Router();
authRouter.get("/", [userMiddleware_1.requireAuth], userControllers_1.user_get);
authRouter.post("/signup", [...validatorServices_1.signUpValidator, validateRequest_1.validateRequest], userControllers_1.signup_post);
authRouter.post("/login", [...validatorServices_1.loginValidator, validateRequest_1.validateRequest], userControllers_1.login_post);
authRouter.post("/refresh", [...validatorServices_1.refreshTokenValidator, validateRequest_1.validateRequest], userControllers_1.refreshToken_post);
authRouter.post("/logout", [...validatorServices_1.refreshTokenValidator, userMiddleware_1.requireAuth, validateRequest_1.validateRequest], userControllers_1.logout_post);
exports.default = authRouter;
