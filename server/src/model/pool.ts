import { Pool, PoolConfig } from "pg";
import { POSTGRES_DB_HOST, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT, POSTGRES_DB_USER } from "../config";

const pc:PoolConfig = {
    user : POSTGRES_DB_USER,
    host : POSTGRES_DB_HOST,
    database : POSTGRES_DB_NAME,
    password : POSTGRES_DB_PASSWORD,
    port : POSTGRES_DB_PORT
}

const pool = new Pool(pc)

export default pool;