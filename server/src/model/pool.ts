import { Pool, PoolConfig } from "pg";
import { DB_HOST } from "../config";

const pc:PoolConfig = {
    user : "postgres",
    host : DB_HOST,
    database : "fileshare",
    password : "root",
    port : 5432,
}

const pool = new Pool(pc)

export default pool;