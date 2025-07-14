import { Request } from "express"

export interface userSignup{
    name:string, 
    email:string,
    password:string,
    confirmPassword:string
}

export interface userLogin{
    email:string,
    password:string
}

export interface userPayload{
    id : string,
    name : string,
    email : string,
}

export interface user{
    id : string,
    name : string,
    email : string,
    password : string
}

export interface AuthorizedRequeset extends Request{
    user:userPayload
}