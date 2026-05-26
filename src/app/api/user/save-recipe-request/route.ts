import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
import { saveRecipeSchema } from "@/lib/validations/user-choices";
import {
  extractRecipeDetails,
  normalizeNutrition,
  normalizeShoppingList,
} from "@/lib/recipe-details";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized: User lacks valid authentication credentials",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const saveRecipeValidation = saveRecipeSchema.safeParse(
      typeof body === "string" ? { menuContent: body } : body
    );

    if (!saveRecipeValidation.success) {
      return NextResponse.json(
        {
          error: saveRecipeValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const { menuContent } = saveRecipeValidation.data;
    const extractedDetails = extractRecipeDetails(menuContent);
    const nutrition = normalizeNutrition(saveRecipeValidation.data.nutrition);
    const shoppingList = normalizeShoppingList(
      saveRecipeValidation.data.shoppingList
    );
    const recipeNutrition =
      nutrition.length > 0 ? nutrition : extractedDetails.nutrition;
    const recipeShoppingList =
      shoppingList.length > 0 ? shoppingList : extractedDetails.shoppingList;

    const userId = session.user.id;

    const savedRecipeResult = await sql(
      `INSERT INTO "recipe" ("id", "country", content", "nutrition", "shoppingList", "userId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2::jsonb, $3::jsonb, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT ("userId", "content")
       DO UPDATE SET
         "nutrition" = EXCLUDED."nutrition",
         "shoppingList" = EXCLUDED."shoppingList",
         "updatedAt" = CURRENT_TIMESTAMP
       RETURNING "id", "title", "country", "content", "imageUrl", "audioUrl", "nutrition", "shoppingList", "userId", "createdAt", "updatedAt"`,
      [
        menuContent,
        JSON.stringify(recipeNutrition),
        JSON.stringify(recipeShoppingList),
        userId,
      ]
    );
    const savedRecipe = savedRecipeResult.rows[0];

    return NextResponse.json(
      {
        message: "recipe added to your favorites",
        savedRecipe,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving recipe:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}
