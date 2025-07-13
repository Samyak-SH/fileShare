import express from "express"


const app = express();

app.get("/ping",(req,res)=>{res.send("Pong")})

app.listen(3000, ()=>{
    console.log("server started on http://localhost:3000");
})