"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionControllers_1 = require("../controlllers/transactionControllers");
const userMiddleware_1 = require("../middleware/userMiddleware");
const validatorServices_1 = require("../services/validatorServices");
const validateRequest_1 = require("../middleware/validateRequest");
const transactionRouter = express_1.default.Router();
transactionRouter.get("/", [userMiddleware_1.requireAuth, ...validatorServices_1.getTransactionsValidator, validateRequest_1.validateRequest], transactionControllers_1.transactions_get);
transactionRouter.get("/:id", [userMiddleware_1.requireAuth, ...validatorServices_1.getTransactionValidator, validateRequest_1.validateRequest], transactionControllers_1.transaction_get);
transactionRouter.post("/transfer", [userMiddleware_1.requireAuth, ...validatorServices_1.transferValidator, validateRequest_1.validateRequest], transactionControllers_1.transaction_post);
exports.default = transactionRouter;
