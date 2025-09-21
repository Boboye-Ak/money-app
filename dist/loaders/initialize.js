"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loadenv_1 = __importDefault(require("./loadenv"));
const initialize = () => {
    (0, loadenv_1.default)();
};
exports.default = initialize;
