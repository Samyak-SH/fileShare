require("dotenv").config({path:"./.env"});
import express, {Application, Request, Response} from "express"
import cors from "cors"
import {userLogin, userSignUp} from "./controller/userController"
import {verifyLoginToken, clearToken} from "./middleware/verification"
import cookieParser from "cookie-parser"
import userRouter from "./router/userRouter"
import { PORT } from "./config";

const app:Application = express();


//middleware
app.use(cookieParser());
app.use(cors({
  origin : true,
  credentials: true,
  exposedHeaders:["set-cookie"]
}));
app.set("trust proxy", true)
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//testing API
app.get("/ping",(req:Request,res:Response)=>{res.send("Pong")});


//authentication
app.post("/signup",userSignUp);
app.post("/login",userLogin);
app.post("/verify", verifyLoginToken);
app.post("/logout", clearToken);

//API
app.use("/api", userRouter);


app.listen(PORT, ()=>{
    console.log(`server started on http://localhost:${PORT}`);
})