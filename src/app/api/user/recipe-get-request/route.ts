import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
import {
  extractRecipeDetails,
  normalizeNutrition,
  normalizeShoppingList,
} from "@/lib/recipe-details";

type SavedRecipeRow = {
  id: string;
  title: string | null;
  country: string | null;
  content: string;
  imageUrl: string | null;
  audioUrl: string | null;
  nutrition: unknown;
  shoppingList: unknown;
  isCooked: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type SelectedCountriesRow = {
  selectedCountries: string[];
};

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: User lacks credential",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const selectedCountriesResult = await sql<SelectedCountriesRow>(
      `SELECT "selectedCountries"
       FROM "user"
       WHERE "id" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    );
    const savedSelectedCountries = selectedCountriesResult.rows;

    const savedRecipesResult = await sql<SavedRecipeRow>(
      `SELECT "id", "title", "country", "content", "imageUrl", "audioUrl", "nutrition", "shoppingList", "userId", "createdAt", "updatedAt", "isCooked"
       FROM "recipe"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    );
    const savedRecipes = savedRecipesResult.rows.map((recipe) => {
      const extractedDetails = extractRecipeDetails(recipe.content);
      const nutrition = normalizeNutrition(recipe.nutrition);
      const shoppingList = normalizeShoppingList(recipe.shoppingList);

      return {
        ...recipe,
        nutrition:
          nutrition.length > 0 ? nutrition : extractedDetails.nutrition,
        shoppingList:
          shoppingList.length > 0
            ? shoppingList
            : extractedDetails.shoppingList,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "recipe retrieved",
        recipes: savedRecipes,
        savedSelectedCountries:
          savedSelectedCountries[0]?.selectedCountries ?? [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
