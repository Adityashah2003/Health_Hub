import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookieStore = cookies();    
    const token = cookieStore.get('token');

    if(!token){
        return NextResponse.json({err: "Session does not exists"}, {status: 404});
    }

    const { value } = token;
    const secret = process.env.JWT_SECRET || '';

    try {
        const decoded = verify(value, secret)
        console.log("Decoded session: ", decoded)
        return NextResponse.json(decoded, {status: 200});
    } catch (error) {
        return NextResponse.json({err: "Internal Server Error"}, {status: 500});
    }
}