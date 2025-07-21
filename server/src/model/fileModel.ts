import { QueryResult } from "pg";
import { uploadedFile, file, updatedFile } from "../types/file";
import pool from "./pool";

export async function createFile(uf:uploadedFile, userId:string) : Promise<string>{
    const result:QueryResult<file> = await pool.query<file>(`INSERT INTO files (filename, uid, type, size, path, customname) values ($1, $2, $3, $4, $5, $6) RETURNING *`, [uf.name, userId, uf.type, uf.size, uf.path, uf.customName]);
    const fid = result.rows[0].fid
    return fid;
}

export async function updateFile(upf:updatedFile) {
    await pool.query(`UPDATE files SET filename=$1, path=$2 WHERE fid=$3`, [upf.updatedName, upf.updatedPath, upf.fid])
}

export async function getUserFiles(userId:string):Promise<file[]> {
    const data:QueryResult<file>= await pool.query<file>(`SELECT * FROM files WHERE uid=$1`,[userId]);
    return data.rows;
}