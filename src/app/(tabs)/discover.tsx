import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { RecipeCard } from "@/components/recipe-card";
import { AppScreen } from "@/components/ui/app-screen";
import { Button } from "@/components/ui/button";
import { cuisineOptions } from "@/data/seed-recipes";
import { useAppStore } from "@/store/app-store";
import { colors, radii } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";

export default function DiscoverScreen() {
  const recipes = useAppStore((state) => state.recipes);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesCountry = country === "All" || recipe.country === country;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${recipe.title} ${recipe.country} ${recipe.tags.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCountry && matchesQuery;
    });
  }, [country, query, recipes]);

  return (
    <AppScreen contentContainerStyle={styles.screen}>
      <View>
        <Text style={styles.eyebrow}>EXPLORE THE WORLD</Text>
        <Text style={styles.title}>What are you craving?</Text>
        <Text style={styles.subtitle}>
          Browse globally inspired recipes or make one fit your preferences.
        </Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search color={colors.inkSoft} size={19} />
          <TextInput
            accessibilityLabel="Search recipes"
            onChangeText={setQuery}
            placeholder="Search recipes or cuisines"
            placeholderTextColor="#9A9F9B"
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />
        </View>
        <View style={styles.filterButton}>
          <SlidersHorizontal color={colors.ink} size={20} />
        </View>
      </View>

      <View style={styles.generatorCard}>
        <View style={styles.generatorIcon}>
          <Sparkles color={colors.primary} size={22} />
        </View>
        <View style={styles.generatorCopy}>
          <Text style={styles.generatorTitle}>Make it yours</Text>
          <Text style={styles.generatorText}>Generate around diet and cuisine.</Text>
        </View>
        <Button
          label="Create"
          onPress={() => router.push(country === "All" ? "/generate" : `/generate?country=${country}`)}
          style={styles.createButton}
        />
      </View>

      <View style={styles.cuisineSection}>
        <Text style={styles.sectionTitle}>Cuisines</Text>
        <ScrollView
          contentContainerStyle={styles.cuisineList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {[{ country: "All", emoji: "🌍" }, ...cuisineOptions].map((option) => {
            const active = country === option.country;
            return (
              <Pressable
                key={option.country}
                onPress={() => setCountry(option.country)}
                style={[styles.cuisineChip, active && styles.cuisineChipActive]}
              >
                <Text style={styles.cuisineEmoji}>{option.emoji}</Text>
                <Text style={[styles.cuisineLabel, active && styles.cuisineLabelActive]}>
                  {option.country}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.sectionTitle}>
          {country === "All" ? "Recipes for you" : `Taste of ${country}`}
        </Text>
        <Text style={styles.resultCount}>{filteredRecipes.length} recipes</Text>
      </View>

      <View style={styles.recipeList}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            onToggleFavorite={() => toggleFavorite(recipe.id)}
            recipe={recipe}
          />
        ))}
        {filteredRecipes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🥄</Text>
            <Text style={styles.emptyTitle}>Nothing on the menu</Text>
            <Text style={styles.emptyText}>Try another search or create a new recipe.</Text>
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 22 },
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
  subtitle: {
    marginTop: 7,
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 21,
  },
  searchRow: { flexDirection: "row", gap: 10 },
  searchBox: {
    minHeight: 50,
    flex: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontFamily: fontFamily.body,
    fontSize: 14,
  },
  filterButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  generatorCard: {
    minHeight: 86,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
  },
  generatorIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.surface,
  },
  generatorCopy: { flex: 1, gap: 2 },
  generatorTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 15,
    fontWeight: "800",
  },
  generatorText: {
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 12,
  },
  createButton: { minHeight: 42, paddingHorizontal: 14 },
  cuisineSection: { gap: 12 },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 22,
    fontWeight: "700",
  },
  cuisineList: { gap: 10, paddingRight: 8 },
  cuisineChip: {
    minHeight: 42,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  cuisineChipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  cuisineEmoji: { fontSize: 17 },
  cuisineLabel: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    fontWeight: "700",
  },
  cuisineLabelActive: { color: colors.white },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  resultCount: {
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 12,
  },
  recipeList: { gap: 16 },
  empty: { paddingVertical: 44, alignItems: "center", gap: 8 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 20,
    fontWeight: "700",
  },
  emptyText: { color: colors.inkSoft, fontFamily: fontFamily.body, fontSize: 14 },
});
