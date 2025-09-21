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
exports.makeTransfer = exports.getTransaction = exports.getTransactions = void 0;
const prisma_1 = __importDefault(require("../configs/prisma"));
const uuid_1 = require("uuid");
const error_1 = require("../types/error");
const getTransactions = (userId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skip = (page - 1) * limit;
        const transactions = yield prisma_1.default.fullTransaction.findMany({
            skip: skip,
            take: limit,
            where: { OR: [{ senderId: userId }, { ReceiverId: userId }] },
        });
        return {
            responseCode: 200,
            message: "Operation Successful",
            transactions,
            count: transactions.length,
        };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error Getting Transaction");
    }
});
exports.getTransactions = getTransactions;
const getTransaction = (userId, tranId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma_1.default.fullTransaction.findFirst({
            where: {
                tranId: tranId,
                OR: [{ senderId: userId }, { ReceiverId: userId }],
            },
        });
        if (!transaction)
            throw new error_1.AppError("Transaction Not Found", 404);
        return { responseCode: 200, message: "Operation Successful", transaction };
    }
    catch (e) {
        return error_1.AppError.handleAppError(e, "Error getting transaction");
    }
});
exports.getTransaction = getTransaction;
const makeTransfer = (senderEmail, receiverEmail, amount, narration) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const tranId = (0, uuid_1.v4)();
            // 1. Lock sender row
            const sender = yield tx.$queryRawUnsafe(`SELECT * FROM [User] WITH (UPDLOCK, ROWLOCK) WHERE email = @p1`, senderEmail);
            if (!sender.length)
                throw new error_1.AppError("Sender not found", 404);
            const senderFlags = yield tx.flags.findFirst({
                where: { customerId: sender[0].id },
            });
            if (sender[0].balance < amount)
                throw new error_1.AppError("Insufficient funds", 400);
            if (senderFlags === null || senderFlags === void 0 ? void 0 : senderFlags.isBlocked)
                throw new Error("Sender is blocked");
            if (!(senderFlags === null || senderFlags === void 0 ? void 0 : senderFlags.isActive))
                throw new Error("Sender is inactive");
            // 2. Lock receiver row
            const receiver = yield tx.$queryRawUnsafe(`SELECT * FROM [User] WITH (UPDLOCK, ROWLOCK) WHERE email = @p1`, receiverEmail);
            if (!receiver.length)
                throw new error_1.AppError("Receiver not found", 404);
            const receiverFlags = yield tx.flags.findFirst({
                where: { customerId: receiver[0].id },
            });
            if (receiverFlags === null || receiverFlags === void 0 ? void 0 : receiverFlags.isBlocked)
                throw new error_1.AppError("Receiver is blocked", 401);
            if (!(receiverFlags === null || receiverFlags === void 0 ? void 0 : receiverFlags.isActive))
                throw new error_1.AppError("Receiver is inactive", 401);
            // 3. Update balances
            yield tx.user.update({
                where: { id: sender[0].id },
                data: { balance: { decrement: amount } },
            });
            yield tx.user.update({
                where: { id: receiver[0].id },
                data: { balance: { increment: amount } },
            });
            // 4. Insert debit leg
            yield tx.transaction.create({
                data: {
                    tranId,
                    amount,
                    part_tran_type: "D",
                    customerId: sender[0].id,
                    customerFirstName: sender[0].firstname,
                    customerLastName: sender[0].lastname,
                    customerEmail: sender[0].email,
                    narration: narration,
                },
            });
            // 5. Insert credit leg
            yield tx.transaction.create({
                data: {
                    tranId,
                    amount,
                    part_tran_type: "C",
                    customerId: receiver[0].id,
                    customerFirstName: receiver[0].firstname,
                    customerLastName: receiver[0].lastname,
                    customerEmail: receiver[0].email,
                    narration: narration,
                },
            });
        }));
        return { message: "Transfer successful", responseCode: 200 };
    }
    catch (e) {
        console.error(e);
        if (e instanceof error_1.AppError)
            return {
                message: e.message || "Transfer failed",
                responseCode: e.responseCode,
            };
        else
            return { message: e.message || "Transfer failed", responseCode: 500 };
    }
});
exports.makeTransfer = makeTransfer;
