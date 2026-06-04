import connectDB from "../../../../config/Db";
import Chat from "../../../../models/Chat";
import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const {userId} =getAuth(req);

        if(!userId){
            return NextResponse.json({success:false,message:"user not authenticated"})
        }

        const chatData ={
            userId,
            message:[],
            name:"New Chat",
        };
        await connectDB();
        await Chat.create(chatData);

        return NextResponse.json({success:true,message:"Chat created"})
    }
    catch(error){
        return NextResponse.json({success:false, error: error.message});
    }
}