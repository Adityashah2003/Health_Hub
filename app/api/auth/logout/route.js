import { deleteToken } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    deleteToken();
    return NextResponse.json({msg: "Logged Out Successfully"}, {status: 200})
}