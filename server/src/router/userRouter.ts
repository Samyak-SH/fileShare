import express, { Router, Request, Response } from "express"
import {verifyToken} from "../middleware/verification"
import { AuthorizedRequeset } from "../types/user";
import { uploadFile } from "../controller/userController";

const userRouter:Router = express.Router();

userRouter.use(verifyToken);

function requestWrapper(req:Request, res:Response, cb:any){
    cb((req as AuthorizedRequeset), res);
}

//only hits after passing the middleware
userRouter.get("/uploadFile",(req:Request, res:Response)=>{
    requestWrapper(req,res, uploadFile);
})

export default userRouter