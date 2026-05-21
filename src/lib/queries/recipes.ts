import { toast } from "sonner";
import type {
  NutritionItem,
  ShoppingListItem,
} from "@/lib/validations/user-choices";

const headers = {
  "Content-Type": "application/json",
};

// ===============================================================================
// If method is not provided, it defaults to "GET"
// You typically don’t need "Content-Type": "application/json"
// Content-Type is mainly relevant when sending a request body (POST, PUT, PATCH)
// ===============================================================================

export const getRetrievingRecipes = async () => {
  const response = await fetch("/api/user/recipe-get-request");

  if (!response.ok) {
    const error = await response.json();
    console.error(error);

    return;
  }

  return response.json();
};

// =====================================================================
// You don’t need Content-Type
// You are not sending a body, so this header is unnecessary:
// Content-Type is only needed when you send: body: JSON.stringify(...)
// =====================================================================

export const handleRecipeDeletion = async (id: string) => {
  const response = await fetch(`/api/user/recipe-deletion?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    toast("recipe couldn't be deleted");
    throw new Error("something has gone wrong");
  }

  toast("recipe deleted");
};

type SaveRecipePayload = {
  menuContent: string;
  nutrition: NutritionItem[];
  shoppingList: ShoppingListItem[];
};

export const handleSavedMenuResponse = async (
  recipePayload: SaveRecipePayload
) => {
  const response = await fetch("/api/user/save-recipe-request", {
    method: "PATCH",
    headers,
    body: JSON.stringify(recipePayload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response:", errorData);
    toast("we couln't save this menu to your database");
    return;
  }

  toast("menu saved to your db");
};

type SelectedCountryPayload = {
  selectedCountry: string;
  vegan: boolean;
  userOtherDietaryRequirements: string;
  isImageGenerated: boolean;
};


export const handleCountrySelectionResponse = async ({
  selectedCountry,
  vegan,
  userOtherDietaryRequirements,
  isImageGenerated,
}: SelectedCountryPayload) => {
  const response = await fetch("/api/user/country-post-request", {
    method: "POST",
    headers,
    body: JSON.stringify({
      country: selectedCountry,
      vegan: vegan,
      other: userOtherDietaryRequirements,
      isImageGenerated,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response:", errorData);
    throw new Error(
      `Failed to update preference: ${JSON.stringify(errorData)}`
    );
  }

  return response;
};

