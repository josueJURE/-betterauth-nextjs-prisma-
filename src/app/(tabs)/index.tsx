import { useMemo } from "react";
import { router } from "expo-router";
import { CalendarPlus, ChevronRight, Sparkles } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { RecipeCard } from "@/components/recipe-card";
import { AppScreen } from "@/components/ui/app-screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { useAppStore } from "@/store/app-store";
import { colors, radii } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";
import { getUpcomingDateKeys, toDateKey } from "@/utils/date";
import type { MealSlot } from "@/validation/schemas";

const slots: { key: MealSlot; label: string; emoji: string }[] = [
  { key: "breakfast", label: "Breakfast", emoji: "☀️" },
  { key: "lunch", label: "Lunch", emoji: "🥗" },
  { key: "dinner", label: "Dinner", emoji: "🌙" },
];

export default function HomeScreen() {
  const recipes = useAppStore((state) => state.recipes);
  const mealPlans = useAppStore((state) => state.mealPlans);
  const preferences = useAppStore((state) => state.preferences);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const today = toDateKey();
  const todayMeals = mealPlans.filter((meal) => meal.planDate === today);
  const featuredRecipe = recipes.find((recipe) => recipe.isFavorite) ?? recipes[0];
  const upcomingDates = useMemo(() => new Set(getUpcomingDateKeys(7)), []);
  const weekMealCount = mealPlans.filter((meal) => upcomingDates.has(meal.planDate)).length;
  const firstName = preferences.name.trim().split(/\s+/)[0] || "explorer";

  return (
    <AppScreen contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>GOOD TO SEE YOU</Text>
          <Text style={styles.heading}>Hello, {firstName}</Text>
        </View>
        <Pressable
          accessibilityLabel="Open profile"
          onPress={() => router.push("/(tabs)/profile")}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Pill label="YOUR NEXT ADVENTURE" tone="warm" />
          <Text style={styles.heroTitle}>Cook beyond your usual</Text>
          <Text style={styles.heroText}>
            Choose a cuisine and turn your preferences into tonight&apos;s recipe.
          </Text>
          <Button
            icon={<Sparkles color={colors.ink} size={18} />}
            label="Create a recipe"
            onPress={() => router.push("/generate")}
            style={styles.heroButton}
            variant="secondary"
          />
        </View>
        <Text style={styles.heroEmoji}>🍲</Text>
      </View>

      <View style={styles.section}>
        <SectionHeader
          actionLabel="Open planner"
          onAction={() => router.push("/(tabs)/planner")}
          title="Today’s plan"
        />
        <Card style={styles.planCard}>
          <View style={styles.weekProgress}>
            <View>
              <Text style={styles.planLabel}>{weekMealCount} MEALS THIS WEEK</Text>
              <Text style={styles.planTitle}>
                {todayMeals.length === 0
                  ? "Your day is wide open"
                  : `${todayMeals.length} of 3 meals planned`}
              </Text>
            </View>
            <View style={styles.calendarIcon}>
              <CalendarPlus color={colors.primary} size={21} />
            </View>
          </View>

          <View style={styles.slotList}>
            {slots.map((slot) => {
              const meal = todayMeals.find((item) => item.mealSlot === slot.key);
              const recipe = meal
                ? recipes.find((item) => item.id === meal.recipeId)
                : undefined;

              return (
                <Pressable
                  key={slot.key}
                  onPress={() => router.push("/(tabs)/planner")}
                  style={styles.slotRow}
                >
                  <Text style={styles.slotEmoji}>{slot.emoji}</Text>
                  <View style={styles.slotCopy}>
                    <Text style={styles.slotLabel}>{slot.label}</Text>
                    <Text numberOfLines={1} style={styles.slotRecipe}>
                      {recipe?.title ?? "Tap to add a meal"}
                    </Text>
                  </View>
                  <ChevronRight color={colors.inkSoft} size={18} />
                </Pressable>
              );
            })}
          </View>
        </Card>
      </View>

      {featuredRecipe ? (
        <View style={styles.section}>
          <SectionHeader
            actionLabel="See all"
            onAction={() => router.push("/(tabs)/discover")}
            title="Saved inspiration"
          />
          <RecipeCard
            onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            onToggleFavorite={() => toggleFavorite(featuredRecipe.id)}
            recipe={featuredRecipe}
          />
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 26 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  heading: {
    marginTop: 3,
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 30,
    fontWeight: "700",
  },
  avatar: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: colors.sage,
  },
  avatarText: {
    color: colors.white,
    fontFamily: fontFamily.display,
    fontSize: 20,
    fontWeight: "700",
  },
  hero: {
    minHeight: 228,
    overflow: "hidden",
    padding: 22,
    borderRadius: radii.lg,
    backgroundColor: colors.ink,
    flexDirection: "row",
  },
  heroCopy: { zIndex: 1, flex: 1, alignItems: "flex-start" },
  heroTitle: {
    maxWidth: 230,
    marginTop: 16,
    color: colors.white,
    fontFamily: fontFamily.display,
    fontSize: 29,
    fontWeight: "700",
    lineHeight: 33,
  },
  heroText: {
    maxWidth: 255,
    marginTop: 8,
    color: "#DCE5DE",
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 20,
  },
  heroButton: { minHeight: 43, marginTop: 18, paddingHorizontal: 14 },
  heroEmoji: {
    position: "absolute",
    right: -13,
    bottom: -16,
    fontSize: 105,
    opacity: 0.9,
  },
  section: { gap: 13 },
  planCard: { padding: 0, overflow: "hidden" },
  weekProgress: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  planLabel: {
    color: colors.primary,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  planTitle: {
    marginTop: 4,
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 15,
    fontWeight: "700",
  },
  calendarIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
  },
  slotList: { paddingHorizontal: 16 },
  slotRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  slotEmoji: { fontSize: 20 },
  slotCopy: { flex: 1, gap: 2 },
  slotLabel: {
    color: colors.inkSoft,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  slotRecipe: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 14,
    fontWeight: "600",
  },
});
