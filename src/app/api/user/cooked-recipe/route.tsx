import { NextResponse, NextRequest } from "next/server";
import { userCookedRecipeSchema } from "@/lib/validations/user-choices";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import { headers } from "next/headers";


export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const body = await request.json();
    console.log(body);

    const userCookedRecipeSchemaValidation =
      userCookedRecipeSchema.safeParse(body);

    if (!userCookedRecipeSchemaValidation.success) {
      return NextResponse.json({
        message: userCookedRecipeSchemaValidation.error.issues[0].message,
        status: 400,
      });
    }

    const { isCooked, recipeId } = userCookedRecipeSchemaValidation.data;
    const userId = session?.user.id;

    console.log("isCooked", isCooked)
    console.log("recipeId", recipeId)

    const updateCookedRecipe = await sql(`
    UPDATE "recipe"
    SET "isCooked" = $1, "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = $2 AND "userId" = $3
    RETURNING "id", "isCooked"

    `, [isCooked, recipeId, userId]);

    if(updateCookedRecipe.rowCount === 0) {
      return NextResponse.json(
        {success: false, message: "recipe not found"},
        {status: 404}
      )
    }

    return NextResponse.json({
      message: "we receive your request",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong, internal system error",
      status: 500,
    });
  }
}
