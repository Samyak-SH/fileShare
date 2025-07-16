import {NextFunction, Request, Response} from "express"
import { JWT_SECRET_KEY } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthorizedRequeset } from "../types/user";

export function verifyToken(req: Request, res: Response, next: NextFunction): Response|undefined{
  const token = req.headers.authorization?.split(" ")[1];
  console.log("headers, ", req.headers);
  if (!token) {
    console.log("no token found");
    return res.status(401).send({ message: "Access denied. No token provided" });
  }

  try {
    const decoded: String | JwtPayload = jwt.verify(token, JWT_SECRET_KEY);
    // Attach the decoded payload (user info) to request
    if(typeof decoded !== "string"){
      (req as AuthorizedRequeset).user = {
        id : (decoded as JwtPayload).id,
        name : (decoded as JwtPayload).name,
        email : (decoded as JwtPayload).email,
      }
      console.log("middleware passed")
      next();
    }else{
      console.log("invalid token");
      return res.status(401).send({message : "Invalid or expired token"});
    }
  } catch (err) {
    console.log("error while decoding token");
    return res.status(401).send({ message: "Invalid or expired token" });
  }
}

export function clearToken(req:Request, res:Response):Response|undefined{
    res.clearCookie("token", {
    httpOnly: true,
    secure: false,         // true in production
    sameSite: "lax",       // must match how you originally set it
  });

  return res.status(200).send("Logged out successfully");
}


export function verifyLoginToken(req:Request,res:Response):Response|undefined{
    const {token} = req.body;

  if (!token) {
    return res.status(401).send("Not logged in");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    res.status(200).json(decoded); // can include user ID/email
  } catch (err) {
    return res.status(403).send("Invalid or expired token");
  }
}


// export default {verifyToken, verifyTokenLogin} 