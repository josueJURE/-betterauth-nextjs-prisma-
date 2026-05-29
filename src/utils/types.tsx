// types/forms.ts
import { z } from "zod";
import { registerFormSchema } from "@/lib/validations/user-choices";
import type {
  NutritionItem,
  ShoppingListItem,
} from "@/lib/validations/user-choices";
import type { CSSProperties, ReactNode } from "react";

export type DropdownMenuComponentType = {
  countries: string[];
  onCountrySelect?: (country: string) => void;
};

// ✅ inferred type from schema
type RegisterFormValues = z.infer<typeof registerFormSchema>;

// ✅ extend with register prop for RHF
export type RegisterFormWithHook = RegisterFormValues & {
  register?: (name: string) => void;
};

export type PostPayload = Record<string, unknown>;

export type OnSwithch = {
  children: ReactNode;
  onChecked: boolean;
  onSwitch: (checked: boolean) => void;
  style?: CSSProperties;
};

export interface ApiResponse {
  recipe: string;
  emailId?: string;
  success: boolean;
  recipeImage?: string;
}

export interface ButtonTypes {
  width: `w-${number}`;
  type: "button";
  label: string;
  onClick?: () => void;
  onRemoveImage?: () => void;
  onInboxBtn?: () => void;
}

export interface DietaryDataType {
  vegan: boolean;
  other: { checked: boolean; text: string };
}

export interface MapProps {
  handleCountrySelect: (countryName: string) => void;
  isDarkMode: boolean;
  selectedCountry: string;
  alreadySelectedCountryObject: Record<string, string>;
  size?: number;
}

export interface GeographyFeature {
  rsmKey: string;
  properties: Record<string, string>;
}

export interface RecipeUIProps {
  email: string;
  name: string;
  vegan: boolean;
}


export interface DietaryRequirementsProps {
  vegan: boolean;
  otherChecked?: boolean;
  onVeganToggle: (checked: boolean) => void;
  onOtherToggle?: (checked: boolean) => void;
}


export interface ReadMoreProps {
  country: string | null;
  id: string;
  text: string;
  nutrition?: NutritionItem[];
  shoppingList?: ShoppingListItem[];
  amountOfWords?: number;
  date: string;
  onDelete?: (id: string) => Promise<void> | void;
  alreadyCooked: boolean;
}
