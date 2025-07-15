import express, { Router, Request, Response } from "express"
import {verifyToken} from "../middleware/verification"
import { AuthorizedRequeset } from "../types/user";
import { uploadFile, getAllFiles, updateFileDetails } from "../controller/fileController";

const userRouter:Router = express.Router();

userRouter.use(verifyToken);

function requestWrapper(req:Request, res:Response, cb:any){
    cb((req as AuthorizedRequeset), res);
}

//only hits after passing the middleware
userRouter.post("/uploadFile",(req:Request, res:Response)=>{
    requestWrapper(req,res, uploadFile);
})

userRouter.post("/updateFile",(req:Request, res:Response)=>{
    requestWrapper(req,res, updateFileDetails);
})

userRouter.get("/getAllFiles",(req:Request, res:Response)=>{
    requestWrapper(req,res, getAllFiles)
})

export default userRouter