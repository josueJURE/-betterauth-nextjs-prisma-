"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";

import type { DropdownMenuComponentType } from "@/utils/types";

export function DropdownMenuComponent({
  countries,
  onCountrySelect,
  

}: DropdownMenuComponentType) {
  const [country, setCountry] = useState<string>("");

  function handleSelectedCountry(selectedCountry: string) {
    setCountry(selectedCountry);
    onCountrySelect?.(selectedCountry);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{country || "Sort by country"}</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          {countries.map((country) => (
            <DropdownMenuItem
              key={country}
              onSelect={() => handleSelectedCountry(country)}
            >
              {country}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
