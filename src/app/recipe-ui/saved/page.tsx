"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookmarkCheck } from "lucide-react";

import {
  getRetrievingRecipes,
  handleRecipeDeletion,
} from "@/lib/queries/recipes";
import { ReadMore } from "@/components/ui/read-more";
import { Button } from "@/components/ui/button";
import {
  appSectionClassName,
  appShellClassName,
  bodyTextClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardHeaderClassName,
  cardTitleClassName,
  heroIconContainerClassName,
  primaryButtonClassName,
  primaryButtonStyle,
  secondaryButtonClassName,
  themeColor,
} from "@/utils/const";
import { DropdownMenuComponent } from "@/components/ui/drop-down-function";
import type {
  NutritionItem,
  ShoppingListItem,
} from "@/lib/validations/user-choices";

export default function SavedRecipes() {
  interface Recipe {
    content: string;
    country: string | null;
    id: string;
    createdAt: string;
    nutrition: NutritionItem[];
    shoppingList: ShoppingListItem[];

    // Add other fields of the recipe object here
  }

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [selectedCountriesArray, setSelectedCountriesArray] = useState<
    string[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const handleSelectedCountry = (country: string) => {
    setSelectedCountry(country);
    console.log("selected country:", country);
    console.log("selectedCountriesArray", selectedCountriesArray)
    console.log("recipes", recipes)
    console.log("selectedCountry", selectedCountry)
   
  };

  // const [recipeID, setRecipeID] = useState<string>("")

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await getRetrievingRecipes();
        setRecipes(response.recipes);
        setSelectedCountriesArray(response.savedSelectedCountries);

        setIsLoading(false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An error has occured"
        );
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDeleteRecipe = async (id: string) => {
    await handleRecipeDeletion(id);
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.id !== id)
    );
  };

  return (
    <main className={appSectionClassName}>
      <div className={appShellClassName}>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className={heroIconContainerClassName}>
            <BookmarkCheck
              className="size-9 sm:size-10"
              style={{ color: themeColor }}
              strokeWidth={2.4}
            />
          </div>

          <div className="space-y-3">
            <h1 className={cardTitleClassName}>Saved Recipes</h1>
            <p className={cardDescriptionClassName}>
              Revisit your favorite generated menus whenever inspiration calls.
            </p>
          </div>
        </div>

        <section className="w-full max-w-5xl">
          <div className={`${cardHeaderClassName} flex flex-col gap-4`}>
            <Button
              asChild
              variant="outline"
              className={`${secondaryButtonClassName} w-full sm:w-fit`}
            >
              <Link href="/recipe-ui">
                <ArrowLeft className="size-4" />
                Back to generator
              </Link>
            </Button>
            {selectedCountriesArray.length > 0 && (
              <DropdownMenuComponent onCountrySelect={ handleSelectedCountry } countries={selectedCountriesArray} />
            )}
          </div>

          <div className={`${cardContentClassName} space-y-4`}>
            {isLoading && (
              <div className="rounded-lg border border-[#dfe8dd] bg-white/80 px-4 py-6 text-center">
                <p className={bodyTextClassName}>Loading saved recipes...</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!isLoading && !error && recipes.length === 0 && (
              <div className="rounded-lg border border-[#dfe8dd] bg-white/80 px-4 py-8 text-center sm:px-5">
                <h2 className="font-serif text-xl font-semibold text-[#24382d] sm:text-2xl">
                  No saved recipes yet
                </h2>
                <p className={`${bodyTextClassName} mt-2`}>
                  Generate a menu, save it, and it will appear here.
                </p>
                <Button
                  asChild
                  className={`${primaryButtonClassName} mt-6 sm:w-auto`}
                  style={primaryButtonStyle}
                >
                  <Link href="/recipe-ui">Create a recipe</Link>
                </Button>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid gap-4">
                {recipes.map((recipe) => (
                  <ReadMore
                    key={recipe.id}
                    id={recipe.id}
                    text={recipe.content}
                    nutrition={recipe.nutrition}
                    shoppingList={recipe.shoppingList}
                    date={recipe.createdAt}
                    onDelete={handleDeleteRecipe}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
