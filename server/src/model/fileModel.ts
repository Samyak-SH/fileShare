import { uploadedFile } from "../types/file";
import pool from "./pool";

export async function createFile(uf:uploadedFile, userId:string){
    await pool.query(`INSERT INTO files (name, uid, type, size, s3_key, path) values ($1, $2, $3, $4, $5, $6)`, [uf.name, userId, uf.type, uf.size, uf.s3_key, uf.path]);
}