import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const initialize = useAppStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!hasHydrated) return <LoadingScreen />;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen
          name="generate"
          options={{ animation: "slide_from_bottom", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
