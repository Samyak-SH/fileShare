import { Pool, PoolConfig } from "pg";

const pc:PoolConfig = {
    user : "postgres",
    host : "localhost",
    database : "fileshare",
    password : "root",
    port : 5432,
}

const pool = new Pool(pc)

export default pool;