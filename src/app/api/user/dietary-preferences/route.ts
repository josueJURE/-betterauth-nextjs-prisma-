

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
// The headers function allows you to read the HTTP incoming request headers from a Server Component.
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function PATCH(request: Request) {
  try {
    // Get the authenticated session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    console.log("session", session)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { vegan } = body;

    // Validate input
    if (typeof vegan !== "boolean") {
      return NextResponse.json(
        { error: "Invalid vegan value. Must be a boolean." },
        { status: 400 }
      );
    }



    // Update or create the user's vegan preference
    const updatedUser = await prisma.userPreferences.upsert({
      where: { userId : userId },
      update: { vegan },
      create: { userId, vegan },
      select: { userId : true, vegan: true }, // It limits how much data Prisma sends back. Without select, Prisma would return the entire user record, including fields you don't need (email, createdAt, etc.)
    });

    return NextResponse.json({
      success: true,
      vegan: updatedUser.vegan,
    });
  } catch (error) {
    console.error("Error updating dietary preferences:", error);
    return NextResponse.json(
      { error: "Failed to update dietary preferences" },
      { status: 500 }
    );
  }
}
