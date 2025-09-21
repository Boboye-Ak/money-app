"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userMiddleware_1 = require("../middleware/userMiddleware");
const adminController_1 = require("../controlllers/adminController");
const validatorServices_1 = require("../services/validatorServices");
const adminRouter = express_1.default.Router();
adminRouter.get("/users", [userMiddleware_1.requireAuth, userMiddleware_1.requireAdmin, ...validatorServices_1.adminGetUsersValidator], adminController_1.adminGetUsers_get);
adminRouter.get("/users/:id", [userMiddleware_1.requireAuth, userMiddleware_1.requireAdmin, ...validatorServices_1.adminGerUserValidator], adminController_1.adminGetUser_get);
adminRouter.put("/users/block/:id", [userMiddleware_1.requireAuth, userMiddleware_1.requireAdmin, ...validatorServices_1.adminBlockAndUnblockUserValidator], adminController_1.adminBlockUser_put);
adminRouter.put("/users/unblock/:id", [userMiddleware_1.requireAuth, userMiddleware_1.requireAdmin, ...validatorServices_1.adminBlockAndUnblockUserValidator], adminController_1.adminUnBlockUser_put);
exports.default = adminRouter;
