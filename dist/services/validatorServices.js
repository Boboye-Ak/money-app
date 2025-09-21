"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBlockAndUnblockUserValidator = exports.adminGerUserValidator = exports.adminGetUsersValidator = exports.getTransactionValidator = exports.getTransactionsValidator = exports.transferValidator = exports.refreshTokenValidator = exports.loginValidator = exports.signUpValidator = exports.extractAuthorizationToken = void 0;
const express_validator_1 = require("express-validator");
const extractAuthorizationToken = (authHeader) => {
    const headerArray = authHeader.split(" ");
    if (headerArray.length !== 2 && headerArray[0] !== "Bearer") {
        return null;
    }
    else {
        return headerArray[1];
    }
};
exports.extractAuthorizationToken = extractAuthorizationToken;
exports.signUpValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email Address"),
    (0, express_validator_1.body)("password")
        .isString()
        .custom((password) => {
        if (password.length < 8)
            throw new Error("Password too short"); // Minimum 8 characters
        const hasNumber = /\d/.test(password); // At least one number
        const hasUppercase = /[A-Z]/.test(password); // At least one uppercase letter
        const hasLowercase = /[a-z]/.test(password); // At least one lowercase letter
        const hasSymbol = /[^A-Za-z0-9]/.test(password); // At least one symbol (non-alphanumeric)
        return hasNumber && hasUppercase && hasLowercase && hasSymbol;
    }),
    (0, express_validator_1.body)("firstName").isString(),
    (0, express_validator_1.body)("lastName").isString(),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email Address"),
    (0, express_validator_1.body)("password").isString().withMessage("Password is missing"),
];
exports.refreshTokenValidator = [
    (0, express_validator_1.body)("refreshToken").isString().withMessage("Enter refresh token"),
];
exports.transferValidator = [
    (0, express_validator_1.body)("receiverEmail")
        .isEmail()
        .withMessage("Receiver email must be valid")
        .custom((value, { req }) => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) && value === req.user.email) {
            throw new Error("You cannot send to your own email");
        }
        return true; // must return true if valid
    }),
];
exports.getTransactionsValidator = [
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be an integer")
        .toInt()
        .default(10),
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page must be an integer")
        .toInt()
        .default(1),
];
exports.getTransactionValidator = [
    (0, express_validator_1.param)("id").isString().withMessage("id must be a string"),
];
exports.adminGetUsersValidator = [
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be an integer")
        .toInt()
        .default(10),
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page must be an integer")
        .toInt()
        .default(1),
];
exports.adminGerUserValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Id must be a positive integer")
        .toInt(),
];
exports.adminBlockAndUnblockUserValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Id must be a positive integer")
        .toInt(),
];
