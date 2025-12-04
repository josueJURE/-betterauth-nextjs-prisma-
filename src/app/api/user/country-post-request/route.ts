import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

console.log("ENV:", process.env.OPENAI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { country } = body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("openai", openai);

    return NextResponse.json({
      success: true,
      pays: country,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
