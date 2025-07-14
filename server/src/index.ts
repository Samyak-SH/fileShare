import express from "express"
import cors from "cors"
import {userLogin, userSignUp} from "./controller/userController"
import {verifyLoginToken, clearToken} from "./middleware/verification"
import cookieParser from "cookie-parser"
import userRouter from "./router/userRouter"

const app = express();


//middleware
app.use(cookieParser());
app.use(cors({
  origin : "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.get("/ping",(req,res)=>{res.send("Pong")});


app.post("/signup",userSignUp);
app.post("/login",userLogin);
app.post("/verify", verifyLoginToken);
app.post("/logout", clearToken);

app.use("/api", userRouter);


app.listen(3000, ()=>{
    console.log("server started on http://localhost:3000");
})