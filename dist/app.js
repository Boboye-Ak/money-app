"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const initialize_1 = __importDefault(require("./loaders/initialize"));
(0, initialize_1.default)();
const environmentVariables_1 = __importDefault(require("./configs/environmentVariables"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const transactionRouter_1 = __importDefault(require("./routers/transactionRouter"));
const adminRouter_1 = __importDefault(require("./routers/adminRouter"));
const helloService_1 = require("./services/helloService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
//Routers
app.use("/api/user", userRouter_1.default);
app.use("/api/transactions", transactionRouter_1.default);
app.use("/api/admin", adminRouter_1.default);
app.get("/", (req, res) => {
    (0, helloService_1.hello)();
    res.status(200).json({ message: "Hello World!" });
});
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});
app.listen(environmentVariables_1.default.port, () => {
    console.log(`Server is listening on port ${environmentVariables_1.default.port}`);
});
exports.default = app;
