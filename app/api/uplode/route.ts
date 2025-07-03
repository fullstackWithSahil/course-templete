import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
	const body = await req.json();
    const response = await axios.post("https://ypdulhtbsj.execute-api.us-east-1.amazonaws.com/default/fileuploderv2", body);
	return new NextResponse(JSON.stringify(response.data));
}