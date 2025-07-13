import pool from "./pool"
import { user, userSignup } from "../types/user"

export async function createUser(u:userSignup) {
    await pool.query(`INSERT INTO USERS (name,email,password) VALUES ($1, $2, $3)`, [u.name, u.email, u.password])
}

export async function findUserViaEmail(email: string): Promise<user|undefined> {
    const data = await pool.query<user>(`SELECT * FROM users WHERE email=$1`, [email])
    return data.rows[0];
}