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
exports.transaction_post = exports.transaction_get = exports.transactions_get = void 0;
const transactionServices_1 = require("../services/transactionServices");
const transactions_get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { userId } = req.user;
    const result = yield (0, transactionServices_1.getTransactions)(userId, page, limit);
    return res.status(result === null || result === void 0 ? void 0 : result.responseCode).json({
        message: result === null || result === void 0 ? void 0 : result.message,
        transactions: result === null || result === void 0 ? void 0 : result.transactions,
        count: result.count,
    });
});
exports.transactions_get = transactions_get;
const transaction_get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = req.params.id;
    const { userId } = req.user;
    const result = yield (0, transactionServices_1.getTransaction)(userId, tranId);
    return res
        .status(result.responseCode)
        .json({ message: result.message, transaction: result.transaction });
});
exports.transaction_get = transaction_get;
const transaction_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: senderEmail } = req.user;
    const { receiverEmail, amount, narration } = req.body;
    const transferResult = yield (0, transactionServices_1.makeTransfer)(senderEmail.toLowerCase(), receiverEmail.toLowerCase(), amount.toFixed(2), narration);
    return res
        .status(transferResult === null || transferResult === void 0 ? void 0 : transferResult.responseCode)
        .json({ message: transferResult === null || transferResult === void 0 ? void 0 : transferResult.message });
});
exports.transaction_post = transaction_post;
