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
exports.adminUnBlockUser_put = exports.adminBlockUser_put = exports.adminGetUser_get = exports.adminGetUsers_get = void 0;
const adminServices_1 = require("../services/adminServices");
const adminGetUsers_get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = yield (0, adminServices_1.adminGetUsers)(page, limit);
    return res
        .status(result.responseCode)
        .json({ message: result.message, users: result.users });
});
exports.adminGetUsers_get = adminGetUsers_get;
const adminGetUser_get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const result = yield (0, adminServices_1.adminGetUser)(id);
    return res
        .status(result.responseCode)
        .json({ message: result.message, user: result.user });
});
exports.adminGetUser_get = adminGetUser_get;
const adminBlockUser_put = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const result = yield (0, adminServices_1.blockUser)(id);
    return res.status(result.responseCode).json({ message: result.message });
});
exports.adminBlockUser_put = adminBlockUser_put;
const adminUnBlockUser_put = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const result = yield (0, adminServices_1.unblockUser)(id);
    return res.status(result.responseCode).json({ message: result.message });
});
exports.adminUnBlockUser_put = adminUnBlockUser_put;
