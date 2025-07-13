import axios  from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export async function verifyToken():Promise<boolean>{
    console.log("verifying token");
    try{
        await axios.post(`${SERVER_URL}/verify`,{},{
            withCredentials : true
        })
        return true;
    }catch(err:any){
        alert("Session expired");
        return false;
    }
}