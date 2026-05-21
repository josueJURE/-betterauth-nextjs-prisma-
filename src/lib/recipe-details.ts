import type {
  NutritionItem,
  ShoppingListItem,
} from "@/lib/validations/user-choices";

export type RecipeDetails = {
  nutrition: NutritionItem[];
  shoppingList: ShoppingListItem[];
};

const nutritionLabels = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "kcal", label: "Calories", unit: "kcal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbohydrates", label: "Carbs", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
  { key: "fibre", label: "Fibre", unit: "g" },
  { key: "fiber", label: "Fibre", unit: "g" },
] as const;

const sectionEndings = [
  "ingredients",
  "instructions",
  "method",
  "shopping list",
  "nutrition",
  "estimated nutrition",
  "cooking instructions",
];

function normalizeLine(line: string) {
  return line
    .replace(/^\s*[-*\u2022]\s+/, "")
    .replace(/^\s*\d+[.)]\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSection(content: string, headings: string[]) {
  const lines = content.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => {
    const normalized = normalizeLine(line).toLowerCase().replace(/:$/, "");
    return headings.some((heading) => normalized.includes(heading));
  });

  if (startIndex === -1) {
    return "";
  }

  const sectionLines: string[] = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const normalized = normalizeLine(currentLine).toLowerCase().replace(/:$/, "");
    const isHeading =
      normalized.length > 0 &&
      sectionEndings.some(
        (heading) =>
          !headings.includes(heading) &&
          (normalized === heading || normalized.startsWith(`${heading}:`))
      );

    if (isHeading) {
      break;
    }

    sectionLines.push(currentLine);
  }

  return sectionLines.join("\n");
}

export function normalizeNutrition(value: unknown): NutritionItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const maybeItem = item as Partial<NutritionItem>;
      const label =
        typeof maybeItem.label === "string" ? maybeItem.label.trim() : "";
      const numericValue =
        typeof maybeItem.value === "number"
          ? maybeItem.value
          : Number(maybeItem.value);
      const unit =
        typeof maybeItem.unit === "string" && maybeItem.unit.trim()
          ? maybeItem.unit.trim()
          : "g";

      if (!label || !Number.isFinite(numericValue) || numericValue < 0) {
        return null;
      }

      return {
        label,
        value: numericValue,
        unit,
      };
    })
    .filter((item): item is NutritionItem => item !== null);
}

export function normalizeShoppingList(value: unknown): ShoppingListItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        const text = normalizeLine(item);
        return text ? { text, checked: false } : null;
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const maybeItem = item as Partial<ShoppingListItem>;
      const text =
        typeof maybeItem.text === "string" ? normalizeLine(maybeItem.text) : "";

      if (!text) {
        return null;
      }

      return {
        text,
        checked: Boolean(maybeItem.checked),
      };
    })
    .filter((item): item is ShoppingListItem => item !== null);
}

function extractNutrition(content: string): NutritionItem[] {
  const nutritionSection =
    extractSection(content, ["nutrition", "estimated nutrition"]) || content;
  const discovered = new Map<string, NutritionItem>();

  for (const line of nutritionSection.split(/\r?\n/)) {
    const normalized = normalizeLine(line);
    const lowerLine = normalized.toLowerCase();
    const matchingLabel = nutritionLabels.find(({ key }) =>
      lowerLine.includes(key)
    );

    if (!matchingLabel) {
      continue;
    }

    const valueMatch = normalized.match(/(\d+(?:\.\d+)?)/);

    if (!valueMatch) {
      continue;
    }

    const numericValue = Number(valueMatch[1]);

    if (!Number.isFinite(numericValue) || numericValue < 0) {
      continue;
    }

    const explicitUnit = normalized.match(/\b(kcal|calories|grams|gram|g|mg)\b/i);
    const unit = explicitUnit
      ? explicitUnit[1].toLowerCase().replace("grams", "g").replace("gram", "g")
      : matchingLabel.unit;

    discovered.set(matchingLabel.label.toLowerCase(), {
      label: matchingLabel.label,
      value: numericValue,
      unit: unit === "calories" ? "kcal" : unit,
    });
  }

  return Array.from(discovered.values());
}

function extractShoppingList(content: string): ShoppingListItem[] {
  const shoppingListSection =
    extractSection(content, ["shopping list"]) ||
    extractSection(content, ["ingredients"]);

  if (!shoppingListSection) {
    return [];
  }

  return shoppingListSection
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter((line) => line.length > 0 && !line.endsWith(":"))
    .slice(0, 50)
    .map((text) => ({ text, checked: false }));
}

export function extractRecipeDetails(content: string): RecipeDetails {
  return {
    nutrition: extractNutrition(content),
    shoppingList: extractShoppingList(content),
  };
}
