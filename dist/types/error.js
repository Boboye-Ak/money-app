"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// src/errors/AppError.ts
class AppError extends Error {
    constructor(message, responseCode) {
        super(message);
        this.responseCode = responseCode;
        // Restore prototype chain (important in TS/Node for instanceof to work)
        Object.setPrototypeOf(this, new.target.prototype);
    }
    // Static method to handle errors consistently
    static handleAppError(e, defaultMessage) {
        console.log(e);
        if (e instanceof AppError) {
            return {
                message: e.message || defaultMessage,
                responseCode: e.responseCode || 500,
            };
        }
        return {
            message: defaultMessage || "Unknown error",
            responseCode: 500,
        };
    }
}
exports.AppError = AppError;
