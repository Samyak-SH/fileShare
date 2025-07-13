import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let toastCallback: ((msg: string) => void) | null = null;

export function setVerifyToastCallback(cb: (msg: string) => void) {
  toastCallback = cb;
}

export async function verifyToken(): Promise<boolean> {
  console.log("verifying token");
  try {
    await axios.post(`${SERVER_URL}/verify`, {}, {
      withCredentials: true
    });
    return true;
  } catch (err: any) {
    if (toastCallback) toastCallback("Session expired");
    return false;
  }
}