import { Response,Request, response } from "express";
import {userSignup, userLogin, user, AuthorizedRequeset} from "../types/user"
import {createUser, findUserViaEmail} from "../model/userModel"
import jwt from "jsonwebtoken"

const SECRET_KEY: string = "MYKEY123";
const EXPIRY_TIME: number = 5;

export async function userLogin(req:Request,res:Response){
    const u:userLogin = {
        email:req.body.email,
        password:req.body.password
    }
    try{
        const fetchedUser: user|undefined = await findUserViaEmail(u.email);
        if(!fetchedUser){
            return res.status(404).send("user not found");
        }else{
            if(u.password===fetchedUser.password){
                const payload: any = {
                    id : fetchedUser.id,
                    name : fetchedUser.name,
                    email : fetchedUser.email,
                }

                const token:string = jwt.sign(payload, SECRET_KEY, {
                    expiresIn : `${EXPIRY_TIME}d`
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge : 24 * 60 * 60 * EXPIRY_TIME * 1000 // <EXPIRY_TIME> days eg if EXPIRY_TIME = 5 then 5 days
                })
                return res.status(200).send("Login success");
            }else{
                return res.status(401).send("Ivalid credentials");
            }
        }
    }catch(err:any){
        console.log("failed to login user", err);
        return res.status(500).send("failed to login user");
    }
}

export async function userSignUp(req:Request,res:Response){
    const u:userSignup = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
    }
    try{
        await createUser(u)
        return res.status(200).send("success");
    }   
    catch(err:any){
        console.error("failed to create user, ",err);
        if(err.code=='23505'){
            return res.status(409).send("User already exists");
        }
        return res.status(500).send("failed to create user");
    } 
}

export async function uploadFile(req:AuthorizedRequeset, res:Response){
    console.log("uploaded user",req.user);
    res.send("uploading file");
}