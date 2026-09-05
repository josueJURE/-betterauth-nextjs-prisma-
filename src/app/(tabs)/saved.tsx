import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Bookmark, Sparkles } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { RecipeCard } from "@/components/recipe-card";
import { AppScreen } from "@/components/ui/app-screen";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { colors, radii } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";

type SavedFilter = "All" | "To cook" | "Cooked";
const filters: SavedFilter[] = ["All", "To cook", "Cooked"];

export default function SavedScreen() {
  const recipes = useAppStore((state) => state.recipes);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const [filter, setFilter] = useState<SavedFilter>("All");

  const savedRecipes = useMemo(
    () =>
      recipes.filter((recipe) => {
        if (!recipe.isFavorite) return false;
        if (filter === "Cooked") return recipe.isCooked;
        if (filter === "To cook") return !recipe.isCooked;
        return true;
      }),
    [filter, recipes],
  );

  return (
    <AppScreen contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
          <Text style={styles.title}>Saved recipes</Text>
        </View>
        <View style={styles.countBadge}>
          <Bookmark color={colors.primary} fill={colors.primary} size={18} />
          <Text style={styles.countText}>{recipes.filter((item) => item.isFavorite).length}</Text>
        </View>
      </View>

      <View style={styles.filters}>
        {filters.map((option) => {
          const active = filter === option;
          return (
            <Pressable
              key={option}
              onPress={() => setFilter(option)}
              style={[styles.filter, active && styles.filterActive]}
            >
              <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {savedRecipes.length > 0 ? (
        <View style={styles.recipeList}>
          {savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              onToggleFavorite={() => toggleFavorite(recipe.id)}
              recipe={recipe}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Bookmark color={colors.primary} size={30} />
          </View>
          <Text style={styles.emptyTitle}>A fresh page</Text>
          <Text style={styles.emptyText}>
            Save recipes you love and they&apos;ll be waiting here when it&apos;s time to cook.
          </Text>
          <Button
            icon={<Sparkles color={colors.white} size={18} />}
            label="Discover recipes"
            onPress={() => router.push("/(tabs)/discover")}
          />
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 22 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: {
    color: colors.primary,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 4,
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 30,
    fontWeight: "700",
  },
  countBadge: {
    minWidth: 54,
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
  },
  countText: {
    color: colors.primary,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 15,
    fontWeight: "800",
  },
  filters: {
    padding: 4,
    flexDirection: "row",
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
  },
  filter: {
    minHeight: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  filterActive: { backgroundColor: colors.surface },
  filterLabel: {
    color: colors.inkSoft,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    fontWeight: "700",
  },
  filterLabelActive: { color: colors.ink },
  recipeList: { gap: 16 },
  emptyState: {
    marginTop: 36,
    paddingHorizontal: 22,
    alignItems: "center",
    gap: 14,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
  },
  emptyTitle: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 25,
    fontWeight: "700",
  },
  emptyText: {
    marginBottom: 6,
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
