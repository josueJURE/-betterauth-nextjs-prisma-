"use client";

import { useMemo, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { formatDatefunction } from "@/utils/helper-functions/helper-functions";
import {
  bodyTextClassName,
  themeColor,
  tabsTriggerClassName,
} from "@/utils/const";

import type { ReadMoreProps } from "@/utils/types";
import { Trash2 } from "lucide-react";

import { AlertDialogCompoment } from "@/components/dialog";
import {
  extractRecipeDetails,
  normalizeNutrition,
  normalizeShoppingList,
} from "@/lib/recipe-details";
import type {
  NutritionItem,
  ShoppingListItem,
} from "@/lib/validations/user-choices";

const nutritionColors = ["#c75a2d", "#6f9b78", "#2f7a95", "#c4a84e", "#8b5cf6"];
const nutritionPreviewCount = 4;
const tabsContentClassName = "mt-4 h-[380px] w-full overflow-hidden";
const recipeCardClassName =
  "flex h-full min-h-0 flex-col gap-4 rounded-lg border-[#dfe8dd] bg-white/95 py-0 shadow-[0_14px_35px_-30px_rgba(36,56,45,0.5)]";
const scrollableCardContentClassName =
  "min-h-0 flex-1 overflow-y-auto px-4 sm:px-5";

function isCalories(item: NutritionItem) {
  return item.label.toLowerCase().includes("calorie");
}

function formatNutritionValue(item: NutritionItem) {
  const value = Number.isInteger(item.value)
    ? item.value.toString()
    : item.value.toFixed(1);

  return `${value} ${item.unit}`;
}

function buildPieBackground(items: NutritionItem[]) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let start = 0;

  const segments = items.map((item, index) => {
    const end = start + (item.value / total) * 100;
    const segment = `${
      nutritionColors[index % nutritionColors.length]
    } ${start}% ${end}%`;
    start = end;
    return segment;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

function NutritionPie({ items }: { items: NutritionItem[] }) {
  const pieItems = items.filter((item) => !isCalories(item) && item.value > 0);
  const total = pieItems.reduce((sum, item) => sum + item.value, 0);
  const chartStyle: CSSProperties =
    total > 0
      ? { background: buildPieBackground(pieItems) }
      : { background: "#edf2ee" };

  if (items.length === 0) {
    return (
      <p className={bodyTextClassName}>
        Nutrition details are not available for this recipe yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
      <div className="flex justify-center">
        <div
          aria-label="Macronutrient pie chart"
          className="relative size-48 rounded-full shadow-[0_18px_40px_-30px_rgba(36,56,45,0.75)]"
          role="img"
          style={chartStyle}
        >
          <div className="absolute inset-9 flex flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="text-xs font-semibold uppercase text-[#657167]">
              Total
            </span>
            <span className="font-serif text-2xl font-semibold text-[#24382d]">
              {Math.round(total)}g
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const pieItemIndex = pieItems.findIndex(
            (pieItem) => pieItem.label === item.label
          );

          return (
            <div
              key={`${item.label}-${index}`}
              className="flex min-h-12 items-center gap-3 rounded-md border border-[#d8e2d6] bg-white px-3 py-2"
            >
              <span
                aria-hidden="true"
                className="size-3 rounded-full"
                style={{
                  backgroundColor:
                    pieItemIndex === -1
                      ? "#24382d"
                      : nutritionColors[pieItemIndex % nutritionColors.length],
                }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#24382d]">
                  {item.label}
                </p>
                <p className="text-sm text-[#657167]">
                  {formatNutritionValue(item)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShoppingChecklist({ items }: { items: ShoppingListItem[] }) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (items.length === 0) {
    return (
      <p className={bodyTextClassName}>
        Shopping-list details are not available for this recipe yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => {
        const itemKey = `${index}-${item.text}`;
        const checked = checkedItems[itemKey] ?? item.checked;

        return (
          <label
            key={itemKey}
            className="flex min-h-12 cursor-pointer items-start gap-3 rounded-md border border-[#d8e2d6] bg-white px-3 py-3 text-sm leading-6 text-[#3f4c43] transition-colors hover:bg-[#f6faf7] sm:text-base"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) =>
                setCheckedItems((current) => ({
                  ...current,
                  [itemKey]: event.target.checked,
                }))
              }
              className="mt-1 size-4 shrink-0 rounded border-[#9fb5a5] accent-[#c75a2d]"
            />
            <span className={checked ? "line-through opacity-60" : undefined}>
              {item.text}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function ReadMore({
  id,
  text,
  date,
  nutrition,
  shoppingList,
  amountOfWords = 50,
  onDelete,
  country
}: ReadMoreProps) {
  console.log("countryReadMore", country)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [recipeId, setRecipeId] = useState<string>("")
  const [isNutritionExpanded, setIsNutritionExpanded] =
    useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isCooked, setIsCooked] = useState<boolean>(false);
  const words = text.trim().split(/\s+/);
  const itCanOverFlow = words.length > amountOfWords;
  const beginText = itCanOverFlow
    ? words.slice(0, amountOfWords).join(" ")
    : text;
  const endText = itCanOverFlow ? words.slice(amountOfWords).join(" ") : "";
  const contentId = `${id}-content`;
  const parsedDate = new Date(date);
  const extractedDetails = useMemo(() => extractRecipeDetails(text), [text]);
  const nutritionItems = useMemo(() => {
    const normalizedNutrition = normalizeNutrition(nutrition);
    return normalizedNutrition.length > 0
      ? normalizedNutrition
      : extractedDetails.nutrition;
  }, [nutrition, extractedDetails.nutrition]);
  const nutritionCanOverflow = nutritionItems.length > nutritionPreviewCount;
  const visibleNutritionItems =
    nutritionCanOverflow && !isNutritionExpanded
      ? nutritionItems.slice(0, nutritionPreviewCount)
      : nutritionItems;
  const shoppingListItems = useMemo(() => {
    const normalizedShoppingList = normalizeShoppingList(shoppingList);
    return normalizedShoppingList.length > 0
      ? normalizedShoppingList
      : extractedDetails.shoppingList;
  }, [shoppingList, extractedDetails.shoppingList]);

  const displayDate = formatDatefunction(parsedDate);
  const nutritionContentId = `${id}-nutrition-content`;


async function toggleCookedRecipes() {
  const response = await fetch('/api/user/cooked-recipe', {
    method: "POST", 
    headers: {

      "Content-Type": "application/json"
    },
    body: JSON.stringify({isCooked, recipeId  })
  })



  console.log("recipeId", recipeId )

  try {
    if(response.ok) {
      const data = await response.json()
      console.log("data", data)
      
      console.log(data.status)
      
     } 

  } catch(error) {
    console.log("error")
  }



} 

  const handleDeleteClick = async () => {
    if (!onDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Tabs
      defaultValue="recipe"
      className="mx-auto w-full max-w-6xl items-center gap-4"
    >
      <TabsList className="!h-auto mx-auto grid w-full max-w-md grid-cols-3 rounded-lg border border-[#d8e2d6] bg-white/80 p-1 shadow-[0_14px_34px_-30px_rgba(36,56,45,0.5)]">
        <TabsTrigger className={tabsTriggerClassName} value="recipe">
          your recipes
        </TabsTrigger>
        <TabsTrigger className={tabsTriggerClassName} value="nutrition">
          Nutrition
        </TabsTrigger>
        <TabsTrigger className={tabsTriggerClassName} value="shopping-list">
          Shopping list
        </TabsTrigger>
      </TabsList>

      <TabsContent className={tabsContentClassName} value="recipe">
        <Card id={id} className={recipeCardClassName}>
          <CardHeader className="px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
            <CardDescription className="text-sm font-medium text-[#657167] sm:text-base flex justify-between w-1xl">
              {displayDate}
              <Button
                id={id}
                className="min-h-11 rounded-md px-4 text-sm font-semibold  sm:text-base"
                onClick={async () => {
                  setRecipeId(id)
                
                  setIsCooked((prev) => !prev);
                  await toggleCookedRecipes();
                }}
              >
                {!isCooked ? "not cooked yet" : "cooked"}
              </Button>
              <div>{country ? country: "unknown"}</div>
            </CardDescription>
          </CardHeader>
          <CardContent
         
            className={scrollableCardContentClassName}
          >
            <p className={bodyTextClassName}>
              {beginText}
              {itCanOverFlow && !isExpanded ? "..." : ""}
              {itCanOverFlow && isExpanded && endText ? ` ${endText}` : ""}
            </p>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
            {itCanOverFlow ? (
              <>
                <Button
              
                  variant="ghost"
                  className="min-h-11 rounded-md px-4 text-sm font-semibold hover:bg-[#f2f7f3] sm:text-base"
                  style={{ color: themeColor }}
                  aria-expanded={isExpanded}
                  aria-controls={contentId}
                  onClick={() => setIsExpanded((expanded) => !expanded)}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </Button>
              </>
            ) : (
              <span aria-hidden="true" />
            )}

            <AlertDialogCompoment
              title="Delete recipe?"
              description="This action cannot be undone."
              actionLabel="Delete"
              actionLoadingLabel="Deleting..."
              disabled={isDeleting}
              onConfirm={handleDeleteClick}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Delete recipe"
                  disabled={isDeleting || !onDelete}
                  className="size-11 rounded-md text-[#8b3b26] hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2
                    className={isDeleting ? "size-4 animate-pulse" : "size-4"}
                  />
                </Button>
              }
            />
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent className={tabsContentClassName} value="nutrition">
        <Card className={recipeCardClassName}>
          <CardHeader className="px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
            <CardTitle className="font-serif text-xl font-semibold text-[#24382d]">
              Nutrition
            </CardTitle>
            <CardDescription className="text-sm text-[#657167]">
              Estimated per serving
            </CardDescription>
          </CardHeader>
          <CardContent
            id={nutritionContentId}
            className={`${scrollableCardContentClassName} pb-4 sm:pb-5`}
          >
            <NutritionPie items={visibleNutritionItems} />
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
            {nutritionCanOverflow ? (
              <Button
                variant="ghost"
                className="min-h-11 rounded-md px-4 text-sm font-semibold hover:bg-[#f2f7f3] sm:text-base"
                style={{ color: themeColor }}
                aria-expanded={isNutritionExpanded}
                aria-controls={nutritionContentId}
                onClick={() => setIsNutritionExpanded((expanded) => !expanded)}
              >
                {isNutritionExpanded ? "Show less" : "Show more"}
              </Button>
            ) : (
              <span aria-hidden="true" />
            )}
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent className={tabsContentClassName} value="shopping-list">
        <Card className={recipeCardClassName}>
          <CardHeader className="px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
            <CardTitle className="font-serif text-xl font-semibold text-[#24382d]">
              Shopping list
            </CardTitle>
            <CardDescription className="text-sm text-[#657167]">
              Ingredients to gather
            </CardDescription>
          </CardHeader>
          <CardContent
            className={`${scrollableCardContentClassName} pb-4 sm:pb-5`}
          >
            <ShoppingChecklist items={shoppingListItems} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
