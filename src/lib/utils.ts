import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// toggleCookedRecipes.ts

export async function toggleCookedRecipes(
  id: number,
  nextIsCooked: boolean,
) {
  const response = await fetch("/api/user/cooked-recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isCooked: nextIsCooked,
      recipeId: id,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update cooked status");
  }
}