require("dotenv").config({path:"./.env"});
import express, {Application, Request, Response} from "express"
import cors from "cors"
import {userLogin, userSignUp} from "./controller/userController"
import {verifyLoginToken, clearToken} from "./middleware/verification"
import cookieParser from "cookie-parser"
import userRouter from "./router/userRouter"
import { MONGODB_URL, PORT, REDIS_HOST, REDIS_PORT, MAX_START_RETRIES, START_RETRY_DELAY_MS } from "./config";
import { createClient } from "redis";
import { RedisClientType } from "@redis/client";
import mongoose from "mongoose";

const app:Application = express();
const redisClient:RedisClientType = createClient({
  socket: {
    host : REDIS_HOST,
    port : REDIS_PORT
  }
});


//middleware
app.use(cookieParser());
app.use(cors({
  origin : true,
  credentials: true,
  exposedHeaders: ['x-auth-token']
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//testing API
app.get("/ping",(req:Request,res:Response)=>{res.status(200).send("Pong")});


//authentication
app.post("/signup",userSignUp);
app.post("/login",userLogin);
app.post("/verify", verifyLoginToken);
app.post("/logout", clearToken);

//API
app.use("/api", userRouter);


const delay = (ms:number) => new Promise((res) => setTimeout(res, ms));

const startServer = async () => {
  let retries = 0;

  while (retries < MAX_START_RETRIES) {
    try {
      await mongoose.connect(MONGODB_URL);
      console.log('Database connected successfully');

      await redisClient.connect()
      console.log("Redis connected successfully");

      app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
      });

      break;
    } catch (err) {
      retries++;
      console.error(`Failed to connect to DB (attempt ${retries}/${START_RETRY_DELAY_MS})`);
      console.error(err);

      if (retries === MAX_START_RETRIES) {
        console.error('Max retries reached. Exiting.');
        process.exit(1);
      }

      console.log(`Retrying in ${START_RETRY_DELAY_MS / 1000}s...\n`);
      await delay(START_RETRY_DELAY_MS);
    }
  }
};
startServer();

export {redisClient}