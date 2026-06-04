import Chat from "../../../../models/Chat";
import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connect } from "node:http2";
import connectDB from "../../../../config/Db";

export async function POST(req){
    try{
        const{userId} =getAuth(req);

        if(!userId){
            return NextResponse.json({
                success:false,
                message:"user not authenticated",
            });
        }
        const{chatId,name}=await req.json();
        // connect with databases and update the chatname
        await connectDB();
        await Chat.findOneAndUpdate({_id:chatId,userId},{name});
        return NextResponse.json({success:true , message:"Chat Renamed"});
    }
    catch(error){
          return NextResponse.json({success:false, error: error.message});
    }
}