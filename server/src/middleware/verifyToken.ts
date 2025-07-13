import {NextFunction, Request, Response} from "express"
const SECRET_KEY = "MYKEY123"
import jwt from "jsonwebtoken";


// const verifyToken = (req:Request, res:Response, next:NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).send({ message: "Access denied. No token provided" });
//   }

//   try {
//     const decoded = verify(token, SECRET_KEY);
//     req.user = decoded;
//     console.log(decoded);
//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send({ message: "Invalid token" });
//   }
// };

export function clearToken(req:Request, res:Response){
    res.clearCookie("token", {
    httpOnly: true,
    secure: false,         // true in production
    sameSite: "lax",       // must match how you originally set it
  });

  return res.status(200).send("Logged out successfully");
}


export function verifyLoginToken(req:Request,res:Response){
    const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Not logged in");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json(decoded); // can include user ID/email
  } catch (err) {
    return res.status(403).send("Invalid or expired token");
  }
}


// export default {verifyToken, verifyTokenLogin} 