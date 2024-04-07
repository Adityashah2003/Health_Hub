import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import pool from "@/db";

export async function GET(){
    const cookieStore = cookies();    
    const token = cookieStore.get('token');

    if(!token){
        return NextResponse.json({err: "Session does not exists"}, {status: 401});
    }

    const { value } = token;
    const secret = process.env.JWT_SECRET || '';

    try {
        const decoded = verify(value, secret)
        const cust_id = decoded.cust_id
        const client = await pool.connect();
        const usernameResult = await client.query(`SELECT USERNAME FROM Customer WHERE Cust_id = ${cust_id}`);
        const username = usernameResult.rows[0]
        return NextResponse.json(username, {status: 200});
    } catch (error) {
        return NextResponse.json({err: "Internal Server Error"}, {status: 500});
    }
}