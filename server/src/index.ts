import express from "express"
import cors from "cors"
import {userLogin, userSignUp} from "./controller/userController"
import {verifyLoginToken} from "./middleware/verifyToken"
import cookieParser from "cookie-parser";

const app = express();


//middleware
app.use(cookieParser())
app.use(cors({
  origin : "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.get("/ping",(req,res)=>{res.send("Pong")});


app.post("/signup",userSignUp)
app.post("/login",userLogin)
app.post("/verify", verifyLoginToken)


app.listen(3000, ()=>{
    console.log("server started on http://localhost:3000");
})