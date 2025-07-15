import { QueryResult } from "pg";
import { uploadedFile, file, updatedFile } from "../types/file";
import pool from "./pool";

export async function createFile(uf:uploadedFile, userId:string){
    await pool.query(`INSERT INTO files (name, uid, type, size, s3_key, path) values ($1, $2, $3, $4, $5, $6)`, [uf.name, userId, uf.type, uf.size, uf.s3_key, uf.path]);
}

export async function updateFile(upf:updatedFile) {
    await pool.query(`UPDATE files SET name=$1, path=$2 WHERE fid=$3`, [upf.updatedName, upf.updatedPath, upf.fid])
}

export async function getUserFiles(userId:string):Promise<file[]> {
    const data:QueryResult<file>= await pool.query<file>(`SELECT * FROM files WHERE uid=$1`,[userId]);
    return data.rows;
}