'use server'
 
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
 
export async function createToken(data) {
    const cookie = cookies().get('token');
    if(cookie){
        console.log('cookie exits:', cookie);
        return NextResponse.next();
    }
    const res = cookies().set('token', data, { secure: true })
    if(!res){
        return NextResponse.json({error: "Failed to set token"}, {status: 500})
    }
    return NextResponse.json({msg: "cookie set successfully"}, {status: 200})
}

export async function deleteToken(data) {
    const response = cookies().delete('token');
    if(response){
        return NextResponse.json(response , {status : 200});
    }
    return NextResponse.json({error: "Failed to delete"}, {status: 500});
}

export async function getToken(){
    const token = cookies().get("token");
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET)
    return decoded.cust_id;
}

// export async function authenticateToken() {
//     try {
//         const token = cookies().get('token');
//         console.log("Token: ",token)
//         if (!token) {
//             return {
//                 success: false, 
//                 username: null,
//             };
//         }
//         const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
//         console.log("Decoded object: ", decoded);
//         return {
//             success: true, 
//             username: decoded.username
//         };
//     } catch (error) {
//         console.error("Error verifying JWT:", error.message);
//         return {
//             success: false, 
//             username: null,
//         };
//     }
// }