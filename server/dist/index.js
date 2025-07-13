"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userController_1 = require("./controller/userController");
const verifyToken_1 = require("./middleware/verifyToken");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/ping", (req, res) => { res.send("Pong"); });
app.post("/signup", userController_1.userSignUp);
app.post("/login", userController_1.userLogin);
app.post("/verify", verifyToken_1.verifyLoginToken);
app.listen(3000, () => {
    console.log("server started on http://localhost:3000");
});
