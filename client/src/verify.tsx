import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let toastCallback: ((msg: string) => void) | null = null;

export function setVerifyToastCallback(cb: (msg: string) => void) {
  toastCallback = cb;
}

export async function verifyToken(): Promise<boolean> {
  console.log("verifying token");
  try {
    const token = localStorage.getItem("x-auth-token");
    await axios.post(`${SERVER_URL}/verify`, {
      token : token
    }, {
      withCredentials: true
    });
    return true;
  } catch (err: any) {
    console.log(err);
    if (toastCallback) toastCallback("Session expired");
    return false;
  }
}