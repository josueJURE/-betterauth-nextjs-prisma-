import { z } from "zod";

// Auth schemas
export const registerFormSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  confirmPassword: z.string().min(2).max(50).optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(50),
  confirmPassword: z.string().min(8).max(50),
});

export const signInFormSchema = registerFormSchema.pick({
  email: true,
  password: true,
});

// User choices schema
export const userChoicesSchema = z.object({
  country: z
    .string()
    .min(2, "Country is required")
    .trim()
    .max(100, "Country name is too long"),
  vegan: z.boolean(),
  other: z.string().max(56, "Additional note is too long").default(""),
  isImageGenerated: z.boolean(),
});

export const userCookedRecipeSchema = z.object({
  isCooked: z.boolean(),
});

export const textToImageSchema = z.object({
  image: z
    .string()
    .min(1, "Image is required")
    .max(20_000_000, "Image is too large")
    .refine((value) => value.startsWith("data:image/"), {
      message: "Image must be a data URL",
    }),
});

export const emailSchema = z.email();

export const countrySchema = z
  .string()
  .min(1, "Country is required")
  .max(30000);

export const userPreference = userChoicesSchema.pick({
  vegan: true,
});

export const userInbox = z.object({
  menuContent: z.string().trim().min(1, "Menu content cannot be empty"),
  backgroundPicture: z.string(),
  recipeAudio: z.string().optional(),
});

export const menuContentForImageSchema = userInbox.pick({
  menuContent: true,
});

export const recipeContentSchema = z
  .string()
  .trim()
  .min(1, "Recipe required")
  .max(50000);

export const nutritionItemSchema = z.object({
  label: z.string().trim().min(1, "Nutrition label is required").max(80),
  value: z.number().nonnegative().max(200000),
  unit: z.string().trim().min(1).max(30).default("g"),
});

export const nutritionSchema = z.array(nutritionItemSchema).max(12);

export const shoppingListItemSchema = z.object({
  text: z.string().trim().min(1, "Shopping list item is required").max(160),
  checked: z.boolean().default(false),
});

export const shoppingListSchema = z.array(shoppingListItemSchema).max(80);

export const saveRecipeSchema = z.object({
  menuContent: recipeContentSchema,
  nutrition: nutritionSchema.default([]),
  shoppingList: shoppingListSchema.default([]),
});

export const pinnedCountrySchema = z.object({
  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100, "Country name is too long"),
});

export const emptySelectedCountryArray = z.object({
  selectedCountry: z.array(z.string()),
});

export const recipeStandardUUIDv4Schema = z.uuid({ version: "v4" });

export const retrieveRecipeSchema = z.boolean();

// Export types
export type RegisterForm = z.infer<typeof registerFormSchema>;
export type SignInForm = z.infer<typeof signInFormSchema>;
export type UserChoices = z.infer<typeof userChoicesSchema>;
export type UserPreference = z.infer<typeof userPreference>;
export type UserInbox = z.infer<typeof userInbox>;
export type MenuContentForImageSchema = z.infer<
  typeof menuContentForImageSchema
>;
export type CountrySchema = z.infer<typeof countrySchema>;
export type RecipeSchema = z.infer<typeof recipeContentSchema>;
export type NutritionItem = z.infer<typeof nutritionItemSchema>;
export type ShoppingListItem = z.infer<typeof shoppingListItemSchema>;
export type SaveRecipeSchema = z.infer<typeof saveRecipeSchema>;
export type RetrieveRecipeSchema = z.infer<typeof retrieveRecipeSchema>;
export type RecipeStandardUUIDv4Schema = z.infer<typeof retrieveRecipeSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;

export type PinnedCountrySchema = z.infer<typeof pinnedCountrySchema>;
export type EmptySelectedCountryArray = z.infer<
  typeof emptySelectedCountryArray
>;
export type TextToImageSchema = z.infer<typeof textToImageSchema>;
export type UserCookedRecipeSchema = z.infer<typeof userCookedRecipeSchema>;
