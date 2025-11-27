"use client";


// #Gladiator2000

import Map from "@/components/map";
import { Button } from "@/components/ui/button";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import DietaryRequirements from "@/components/ui/dietary-requirements";
import { Input } from "@/components/ui/input";

export default function Test() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [otherDietaryRequirements, setOtherDietaryRequirements] =
    useState<boolean>(false);


  const handleDietaryRequirements = (checked: boolean) => {
    setOtherDietaryRequirements(checked)
  }
  

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center p-4">
        <form className="w-full max-w-xl p-6 relative bg-gray-700 rounded-2xl">
          <Card className=" flex items-center">
            <DietaryRequirements onToggle={handleDietaryRequirements} />
            {otherDietaryRequirements && <Input type="text" className="w-0.25xl" />}

            <div>{selectedCountry}</div>

            <Map
              handleCountrySelect={handleCountrySelect}
              isDarkMode={isDarkMode}
            />
               <Button>Submit</Button>
          </Card>
       
        </form>
      </main>
    </>
  );
}
