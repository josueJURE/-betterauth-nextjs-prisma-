import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Plus,
  ShoppingBasket,
  Users,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MealPickerSheet } from "@/components/meal-picker-sheet";
import { AppScreen } from "@/components/ui/app-screen";
import { Card } from "@/components/ui/card";
import { DayPicker } from "@/components/ui/day-picker";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";
import {
  formatDateHeading,
  getUpcomingDateKeys,
  toDateKey,
} from "@/utils/date";
import type { MealSlot } from "@/validation/schemas";

const slots: { key: MealSlot; label: string; caption: string; emoji: string }[] = [
  { key: "breakfast", label: "Breakfast", caption: "Start the day", emoji: "☀️" },
  { key: "lunch", label: "Lunch", caption: "Midday fuel", emoji: "🥗" },
  { key: "dinner", label: "Dinner", caption: "End on a high note", emoji: "🌙" },
];

export default function PlannerScreen() {
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const recipes = useAppStore((state) => state.recipes);
  const mealPlans = useAppStore((state) => state.mealPlans);
  const selectedDate = useAppStore((state) => state.selectedDate);
  const setSelectedDate = useAppStore((state) => state.setSelectedDate);
  const planMeal = useAppStore((state) => state.planMeal);
  const removeMeal = useAppStore((state) => state.removeMeal);
  const toggleMealCompleted = useAppStore((state) => state.toggleMealCompleted);
  const [activeSlot, setActiveSlot] = useState<MealSlot | null>(null);

  const datesWithMeals = useMemo(
    () => [...new Set(mealPlans.map((meal) => meal.planDate))],
    [mealPlans],
  );
  const selectedMeals = mealPlans.filter((meal) => meal.planDate === selectedDate);
  const activeMeal = activeSlot
    ? selectedMeals.find((meal) => meal.mealSlot === activeSlot)
    : undefined;
  const upcomingDates = useMemo(() => new Set(getUpcomingDateKeys(7)), []);
  const upcomingMeals = mealPlans.filter((meal) => upcomingDates.has(meal.planDate));
  const shoppingItems = useMemo(() => {
    const names = new Set<string>();
    for (const meal of upcomingMeals) {
      const recipe = recipes.find((item) => item.id === meal.recipeId);
      recipe?.ingredients.forEach((ingredient) => names.add(ingredient.name));
    }
    return [...names].slice(0, 5);
  }, [recipes, upcomingMeals]);

  return (
    <>
      <AppScreen contentContainerStyle={styles.screen}>
        <View>
          <Text style={styles.eyebrow}>PLAN AHEAD</Text>
          <Text style={styles.title}>Meal planner</Text>
          <Text style={styles.subtitle}>
            A calm week starts with knowing what&apos;s for dinner.
          </Text>
        </View>

        <DayPicker
          datesWithMeals={datesWithMeals}
          minDate={toDateKey()}
          onSelect={setSelectedDate}
          selectedDate={selectedDate}
        />

        <View style={styles.dayHeader}>
          <View>
            <Text style={styles.dayTitle}>{formatDateHeading(selectedDate)}</Text>
            <Text style={styles.dayCount}>{selectedMeals.length} of 3 meals planned</Text>
          </View>
          <View style={styles.progressRing}>
            <Text style={styles.progressText}>{selectedMeals.length}/3</Text>
          </View>
        </View>

        <View style={styles.mealList}>
          {slots.map((slot) => {
            const meal = selectedMeals.find((item) => item.mealSlot === slot.key);
            const recipe = meal
              ? recipes.find((item) => item.id === meal.recipeId)
              : undefined;

            return (
              <Card key={slot.key} style={styles.mealCard}>
                <View style={styles.slotIcon}>
                  <Text style={styles.slotEmoji}>{slot.emoji}</Text>
                </View>
                <Pressable
                  onPress={() => setActiveSlot(slot.key)}
                  style={styles.mealContent}
                >
                  <Text style={styles.slotLabel}>{slot.label}</Text>
                  <Text numberOfLines={1} style={recipe ? styles.mealTitle : styles.emptyMealTitle}>
                    {recipe?.title ?? slot.caption}
                  </Text>
                  {meal ? (
                    <View style={styles.servingRow}>
                      <Users color={colors.inkSoft} size={13} />
                      <Text style={styles.servingText}>{meal.servings} servings</Text>
                    </View>
                  ) : null}
                </Pressable>
                {meal ? (
                  <Pressable
                    accessibilityLabel={meal.completed ? "Mark meal incomplete" : "Mark meal complete"}
                    hitSlop={8}
                    onPress={() => void toggleMealCompleted(meal.id)}
                    style={styles.completeButton}
                  >
                    {meal.completed ? (
                      <CheckCircle2 color={colors.sage} fill={colors.sageSoft} size={24} />
                    ) : (
                      <Circle color={colors.border} size={24} />
                    )}
                  </Pressable>
                ) : (
                  <Pressable
                    accessibilityLabel={`Add ${slot.label}`}
                    onPress={() => setActiveSlot(slot.key)}
                    style={styles.addButton}
                  >
                    <Plus color={colors.primary} size={20} />
                  </Pressable>
                )}
              </Card>
            );
          })}
        </View>

        <Card style={styles.shoppingCard}>
          <View style={styles.shoppingHeader}>
            <View style={styles.shoppingIcon}>
              <ShoppingBasket color={colors.gold} size={22} />
            </View>
            <View style={styles.shoppingCopy}>
              <Text style={styles.shoppingTitle}>This week’s shopping</Text>
              <Text style={styles.shoppingSubtitle}>
                {shoppingItems.length > 0
                  ? `${shoppingItems.length}+ ingredients from planned meals`
                  : "Plan meals to build your list"}
              </Text>
            </View>
            <ChevronRight color={colors.inkSoft} size={20} />
          </View>
          {shoppingItems.length > 0 ? (
            <View style={styles.shoppingList}>
              {shoppingItems.map((item) => (
                <View key={item} style={styles.shoppingItem}>
                  <View style={styles.checkBox}>
                    <Check color={colors.sage} size={12} strokeWidth={3} />
                  </View>
                  <Text style={styles.shoppingItemText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </Card>
      </AppScreen>

      {activeSlot ? (
        <MealPickerSheet
          date={selectedDate}
          existingMeal={activeMeal}
          onClose={() => setActiveSlot(null)}
          onRemove={
            activeMeal ? () => removeMeal(activeMeal.id) : undefined
          }
          onSave={(recipeId, servings) =>
            planMeal({
              planDate: selectedDate,
              mealSlot: activeSlot,
              recipeId,
              servings,
            })
          }
          preferredRecipeId={params.recipeId}
          recipes={recipes}
          slot={activeSlot}
          visible
        />
      ) : null}
    </>
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
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayTitle: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 23,
    fontWeight: "700",
  },
  dayCount: {
    marginTop: 4,
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 13,
  },
  progressRing: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.primarySoft,
    borderTopColor: colors.primary,
    borderRadius: 24,
  },
  progressText: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 12,
    fontWeight: "800",
  },
  mealList: { gap: 11 },
  mealCard: {
    minHeight: 92,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  slotIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.surfaceMuted,
  },
  slotEmoji: { fontSize: 25 },
  mealContent: { flex: 1, justifyContent: "center", gap: 3 },
  slotLabel: {
    color: colors.primary,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  mealTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 15,
    fontWeight: "800",
  },
  emptyMealTitle: {
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 14,
  },
  servingRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  servingText: { color: colors.inkSoft, fontFamily: fontFamily.body, fontSize: 12 },
  completeButton: { padding: 7 },
  addButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
  },
  shoppingCard: { padding: 0, overflow: "hidden" },
  shoppingHeader: {
    minHeight: 82,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shoppingIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.goldSoft,
  },
  shoppingCopy: { flex: 1, gap: 3 },
  shoppingTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 15,
    fontWeight: "800",
  },
  shoppingSubtitle: { color: colors.inkSoft, fontFamily: fontFamily.body, fontSize: 12 },
  shoppingList: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 13,
  },
  shoppingItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    backgroundColor: colors.sageSoft,
  },
  shoppingItemText: { color: colors.ink, fontFamily: fontFamily.body, fontSize: 13 },
});
