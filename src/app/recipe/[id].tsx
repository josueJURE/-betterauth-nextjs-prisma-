import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Heart,
  Minus,
  ShoppingBasket,
  Users,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/ui/app-screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { useAppStore } from "@/store/app-store";
import { colors, radii } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";

type DetailTab = "Recipe" | "Nutrition" | "Shopping";
const detailTabs: DetailTab[] = ["Recipe", "Nutrition", "Shopping"];

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const recipes = useAppStore((state) => state.recipes);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const toggleCooked = useAppStore((state) => state.toggleCooked);
  const recipe = recipes.find((item) => item.id === params.id);
  const [activeTab, setActiveTab] = useState<DetailTab>("Recipe");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const calories = recipe?.nutrition.find((item) => item.label.toLowerCase().includes("calorie"));
  const macros = recipe?.nutrition.filter((item) => item !== calories) ?? [];
  const shoppingProgress = recipe
    ? Math.round((checkedIngredients.size / recipe.ingredients.length) * 100)
    : 0;

  const sortedTags = recipe?.tags.slice(0, 4) ?? [];

  if (!recipe) {
    return (
      <AppScreen contentContainerStyle={styles.notFound}>
        <Text style={styles.notFoundEmoji}>🍽️</Text>
        <Text style={styles.notFoundTitle}>Recipe not found</Text>
        <Button label="Go back" onPress={() => router.back()} variant="secondary" />
      </AppScreen>
    );
  }

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <AppScreen contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.roundButton}>
          <ChevronLeft color={colors.ink} size={23} />
        </Pressable>
        <Text style={styles.headerTitle}>Recipe</Text>
        <Pressable
          accessibilityLabel={recipe.isFavorite ? "Remove from saved" : "Save recipe"}
          onPress={() => void toggleFavorite(recipe.id)}
          style={styles.roundButton}
        >
          <Heart
            color={recipe.isFavorite ? colors.primary : colors.ink}
            fill={recipe.isFavorite ? colors.primary : "transparent"}
            size={21}
          />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroOrb} />
        <Text style={styles.heroEmoji}>{recipe.emoji}</Text>
        <View style={styles.countryBadge}>
          <Text style={styles.countryText}>{recipe.country.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.summary}>{recipe.summary}</Text>
        <View style={styles.tagList}>
          {sortedTags.map((tag, index) => (
            <Pill key={tag} label={tag} tone={index === 0 ? "warm" : "sage"} />
          ))}
        </View>
      </View>

      <Card style={styles.quickFacts}>
        <View style={styles.fact}>
          <Clock3 color={colors.primary} size={20} />
          <Text style={styles.factValue}>{recipe.durationMinutes} min</Text>
          <Text style={styles.factLabel}>TOTAL</Text>
        </View>
        <View style={styles.factDivider} />
        <View style={styles.fact}>
          <Users color={colors.sage} size={20} />
          <Text style={styles.factValue}>2 people</Text>
          <Text style={styles.factLabel}>SERVES</Text>
        </View>
        <View style={styles.factDivider} />
        <View style={styles.fact}>
          <Minus color={colors.gold} size={20} />
          <Text style={styles.factValue}>{recipe.difficulty}</Text>
          <Text style={styles.factLabel}>LEVEL</Text>
        </View>
      </Card>

      <View style={styles.tabs}>
        {detailTabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === "Recipe" ? (
        <View style={styles.tabContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Pill label={`${recipe.ingredients.length} items`} tone="neutral" />
          </View>
          <Card style={styles.ingredientCard}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={`${ingredient.name}-${index}`} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.quantity}>{ingredient.quantity}</Text>
              </View>
            ))}
          </Card>

          <Text style={styles.sectionTitle}>Method</Text>
          <View style={styles.steps}>
            {recipe.instructions.map((instruction, index) => (
              <View key={`${index}-${instruction}`} style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {activeTab === "Nutrition" ? (
        <View style={styles.tabContent}>
          <Card style={styles.calorieCard}>
            <View>
              <Text style={styles.calorieLabel}>ENERGY PER SERVING</Text>
              <Text style={styles.calorieValue}>
                {calories ? Math.round(calories.value) : "—"}
              </Text>
              <Text style={styles.calorieUnit}>{calories?.unit ?? "kcal"}</Text>
            </View>
            <View style={styles.calorieEmoji}>
              <Text style={{ fontSize: 36 }}>⚡</Text>
            </View>
          </Card>
          <View style={styles.macroGrid}>
            {macros.map((item, index) => {
              const tones = [colors.primary, colors.sage, colors.gold, "#6B7EB5"];
              const tone = tones[index % tones.length] ?? colors.primary;
              return (
                <Card key={item.label} style={styles.macroCard}>
                  <View style={[styles.macroDot, { backgroundColor: tone }]} />
                  <Text style={styles.macroLabel}>{item.label}</Text>
                  <Text style={styles.macroValue}>
                    {Number.isInteger(item.value) ? item.value : item.value.toFixed(1)} {item.unit}
                  </Text>
                </Card>
              );
            })}
          </View>
          <Text style={styles.nutritionNote}>
            Nutrition is an estimate and varies with ingredients and portion size.
          </Text>
        </View>
      ) : null}

      {activeTab === "Shopping" ? (
        <View style={styles.tabContent}>
          <Card style={styles.shoppingProgressCard}>
            <View style={styles.shoppingProgressHeader}>
              <View style={styles.shoppingIcon}>
                <ShoppingBasket color={colors.primary} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.shoppingTitle}>Shopping list</Text>
                <Text style={styles.shoppingCaption}>
                  {checkedIngredients.size} of {recipe.ingredients.length} gathered
                </Text>
              </View>
              <Text style={styles.shoppingPercent}>{shoppingProgress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${shoppingProgress}%` }]} />
            </View>
          </Card>

          <Card style={styles.checklistCard}>
            {recipe.ingredients.map((ingredient, index) => {
              const checked = checkedIngredients.has(index);
              return (
                <Pressable
                  key={`${ingredient.name}-${index}`}
                  onPress={() => toggleIngredient(index)}
                  style={styles.checklistRow}
                >
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked ? <Check color={colors.white} size={14} strokeWidth={3} /> : null}
                  </View>
                  <View style={styles.checklistCopy}>
                    <Text style={[styles.checklistName, checked && styles.checkedText]}>
                      {ingredient.name}
                    </Text>
                    <Text style={[styles.checklistQuantity, checked && styles.checkedText]}>
                      {ingredient.quantity}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </Card>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          fullWidth
          icon={
            <CalendarPlus
              color={colors.white}
              size={19}
            />
          }
          label="Plan this meal"
          onPress={() => router.push(`/(tabs)/planner?recipeId=${recipe.id}`)}
        />
        <Button
          fullWidth
          icon={
            <CheckCircle2
              color={recipe.isCooked ? colors.sage : colors.ink}
              size={19}
            />
          }
          label={recipe.isCooked ? "Cooked" : "Mark as cooked"}
          onPress={() => void toggleCooked(recipe.id)}
          variant="secondary"
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 22 },
  notFound: { flexGrow: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  notFoundEmoji: { fontSize: 54 },
  notFoundTitle: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 24,
    fontWeight: "700",
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roundButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 16,
    fontWeight: "800",
  },
  hero: {
    minHeight: 242,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.lg,
    backgroundColor: colors.sageSoft,
  },
  heroOrb: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255,255,255,0.62)",
  },
  heroEmoji: { fontSize: 100 },
  countryBadge: {
    position: "absolute",
    left: 14,
    bottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.ink,
  },
  countryText: {
    color: colors.white,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  titleBlock: { gap: 10 },
  title: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 31,
    fontWeight: "700",
    lineHeight: 36,
  },
  summary: {
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 21,
  },
  tagList: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  quickFacts: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  fact: { flex: 1, alignItems: "center", gap: 4 },
  factValue: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    fontWeight: "800",
  },
  factLabel: {
    color: colors.inkSoft,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  factDivider: { width: 1, height: 45, backgroundColor: colors.border },
  tabs: {
    padding: 4,
    flexDirection: "row",
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
  },
  tab: {
    minHeight: 42,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  tabActive: { backgroundColor: colors.surface },
  tabLabel: {
    color: colors.inkSoft,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    fontWeight: "700",
  },
  tabLabelActive: { color: colors.ink },
  tabContent: { gap: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 22,
    fontWeight: "700",
  },
  ingredientCard: { paddingVertical: 4 },
  ingredientRow: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  bullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  ingredientName: { flex: 1, color: colors.ink, fontFamily: fontFamily.bodyMedium, fontSize: 13 },
  quantity: { maxWidth: "43%", color: colors.inkSoft, fontFamily: fontFamily.body, fontSize: 12, textAlign: "right" },
  steps: { gap: 18 },
  step: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  stepNumber: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  stepNumberText: {
    color: colors.primary,
    fontFamily: fontFamily.display,
    fontSize: 16,
    fontWeight: "700",
  },
  stepText: { flex: 1, color: colors.ink, fontFamily: fontFamily.body, fontSize: 14, lineHeight: 22 },
  calorieCard: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  calorieLabel: {
    color: colors.primary,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  calorieValue: {
    marginTop: 5,
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 45,
  },
  calorieUnit: { color: colors.inkSoft, fontFamily: fontFamily.body, fontSize: 12 },
  calorieEmoji: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  macroGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  macroCard: { width: "48%", gap: 5 },
  macroDot: { width: 9, height: 9, borderRadius: 5 },
  macroLabel: { color: colors.inkSoft, fontFamily: fontFamily.bodyMedium, fontSize: 11 },
  macroValue: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 22,
    fontWeight: "700",
  },
  nutritionNote: {
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
  shoppingProgressCard: { gap: 13 },
  shoppingProgressHeader: { flexDirection: "row", alignItems: "center", gap: 11 },
  shoppingIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
  },
  shoppingTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 15,
    fontWeight: "800",
  },
  shoppingCaption: { marginTop: 2, color: colors.inkSoft, fontFamily: fontFamily.body, fontSize: 12 },
  shoppingPercent: {
    color: colors.primary,
    fontFamily: fontFamily.display,
    fontSize: 20,
    fontWeight: "700",
  },
  progressTrack: { height: 7, overflow: "hidden", borderRadius: 4, backgroundColor: colors.surfaceMuted },
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.primary },
  checklistCard: { paddingVertical: 4 },
  checklistRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
  },
  checkboxChecked: { borderColor: colors.sage, backgroundColor: colors.sage },
  checklistCopy: { flex: 1, gap: 2 },
  checklistName: { color: colors.ink, fontFamily: fontFamily.bodyMedium, fontSize: 13 },
  checklistQuantity: { color: colors.inkSoft, fontFamily: fontFamily.body, fontSize: 11 },
  checkedText: { textDecorationLine: "line-through", opacity: 0.55 },
  actions: { gap: 10 },
});
