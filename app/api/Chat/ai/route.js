export const maxDuration = 60;
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Chat from "../../../../models/Chat";
import { GoogleGenAI } from "@google/genai";
import connectDB from "../../../../config/Db";

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.OPENAI_API_KEY, // Keep this if your env variable name is OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    // Extract chatId and prompt
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Connect DB
    await connectDB();

    const data = await Chat.findOne({
      userId,
      _id: chatId,
    });

    if (!data) {
      return NextResponse.json({
        success: false,
        message: "Chat not found",
      });
    }

    // User message
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.message.push(userPrompt);

    // Gemini API Call
    const completion = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // const message = {
    //   role: "assistant",
    //   content: completion.text,
    //   timeStamp: Date.now(),
    // };
    const assistantMessage = {
  role: "assistant",
  content: completion.text,
  timestamp: Date.now(),
};

    // data.message.push(message);
  data.message.push(assistantMessage);
    await data.save();

    return NextResponse.json({
      success: true,
      data: assistantMessage,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}