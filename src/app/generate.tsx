import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Leaf, ShieldCheck, Sparkles } from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppScreen } from "@/components/ui/app-screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cuisineOptions } from "@/data/seed-recipes";
import { useAppStore } from "@/store/app-store";
import { colors, radii } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";
import { generationRequestSchema } from "@/validation/schemas";

export default function GenerateScreen() {
  const params = useLocalSearchParams<{ country?: string }>();
  const preferences = useAppStore((state) => state.preferences);
  const createRecipe = useAppStore((state) => state.createRecipe);
  const isGenerating = useAppStore((state) => state.isGenerating);
  const [country, setCountry] = useState(
    typeof params.country === "string" && params.country ? params.country : cuisineOptions[0]?.country ?? "",
  );
  const [vegan, setVegan] = useState(preferences.vegan);
  const [glutenFree, setGlutenFree] = useState(preferences.glutenFree);
  const [dietaryNotes, setDietaryNotes] = useState(preferences.dietaryNotes);
  const [formError, setFormError] = useState<string | null>(null);
  const selectedCuisine = cuisineOptions.find((option) => option.country === country);

  const handleGenerate = async () => {
    const result = generationRequestSchema.safeParse({
      country,
      vegan,
      glutenFree,
      dietaryNotes,
    });

    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? "Check your choices");
      return;
    }

    setFormError(null);
    try {
      const recipe = await createRecipe(result.data);
      router.replace(`/recipe/${recipe.id}`);
    } catch {
      setFormError("We couldn't create that recipe. Please try again.");
    }
  };

  return (
    <AppScreen contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={colors.ink} size={23} />
        </Pressable>
        <Text style={styles.headerTitle}>Create a recipe</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>{selectedCuisine?.emoji ?? "🍽️"}</Text>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>CURATED FOR YOU</Text>
          <Text style={styles.heroTitle}>
            {country ? `A taste of ${country}` : "Choose your next destination"}
          </Text>
          <Text style={styles.heroText}>
            We&apos;ll adapt a tested recipe to the way you like to eat.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pick a cuisine</Text>
        <View style={styles.cuisineGrid}>
          {cuisineOptions.map((option) => {
            const selected = country === option.country;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                key={option.country}
                onPress={() => setCountry(option.country)}
                style={[styles.cuisineCard, selected && styles.cuisineCardSelected]}
              >
                <Text style={styles.cuisineEmoji}>{option.emoji}</Text>
                <Text style={[styles.cuisineLabel, selected && styles.cuisineLabelSelected]}>
                  {option.country}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Make it work for you</Text>
        <Card style={styles.preferenceCard}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceIcon}>
              <Leaf color={colors.sage} size={21} />
            </View>
            <View style={styles.preferenceCopy}>
              <Text style={styles.preferenceTitle}>Plant-based</Text>
              <Text style={styles.preferenceText}>Swap meat and fish for vegetables.</Text>
            </View>
            <Switch
              onValueChange={setVegan}
              thumbColor={colors.white}
              trackColor={{ false: "#C9CDC9", true: colors.sage }}
              value={vegan}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.preferenceRow}>
            <View style={[styles.preferenceIcon, { backgroundColor: colors.goldSoft }]}>
              <ShieldCheck color={colors.gold} size={21} />
            </View>
            <View style={styles.preferenceCopy}>
              <Text style={styles.preferenceTitle}>Gluten-free</Text>
              <Text style={styles.preferenceText}>Use suitable grains and seasonings.</Text>
            </View>
            <Switch
              onValueChange={setGlutenFree}
              thumbColor={colors.white}
              trackColor={{ false: "#C9CDC9", true: colors.sage }}
              value={glutenFree}
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anything else?</Text>
        <TextInput
          accessibilityLabel="Dietary notes"
          maxLength={180}
          multiline
          onChangeText={setDietaryNotes}
          placeholder="Allergies, ingredients to avoid, or a serving note"
          placeholderTextColor="#969D98"
          style={styles.notesInput}
          textAlignVertical="top"
          value={dietaryNotes}
        />
        <Text style={styles.characterCount}>{dietaryNotes.length}/180</Text>
      </View>

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <Button
        fullWidth
        icon={<Sparkles color={colors.white} size={19} />}
        label={isGenerating ? "Creating your recipe" : "Create my recipe"}
        loading={isGenerating}
        onPress={() => void handleGenerate()}
      />
      <Text style={styles.localNote}>
        Generated locally from curated recipes—no API key or token spend required.
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 24 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: {
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
  headerSpacer: { width: 42 },
  hero: {
    minHeight: 170,
    overflow: "hidden",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: radii.lg,
    backgroundColor: colors.ink,
  },
  heroEmoji: { fontSize: 64 },
  heroCopy: { flex: 1 },
  eyebrow: {
    color: "#E8BCA8",
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  heroTitle: {
    marginTop: 5,
    color: colors.white,
    fontFamily: fontFamily.display,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 29,
  },
  heroText: {
    marginTop: 7,
    color: "#D7E0D9",
    fontFamily: fontFamily.body,
    fontSize: 13,
    lineHeight: 19,
  },
  section: { gap: 12 },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 21,
    fontWeight: "700",
  },
  cuisineGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  cuisineCard: {
    width: "31%",
    minWidth: 96,
    minHeight: 82,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  cuisineCardSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  cuisineEmoji: { fontSize: 27 },
  cuisineLabel: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 12,
    fontWeight: "700",
  },
  cuisineLabelSelected: { color: colors.primary },
  preferenceCard: { paddingVertical: 4 },
  preferenceRow: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 11 },
  preferenceIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.sageSoft,
  },
  preferenceCopy: { flex: 1, gap: 3 },
  preferenceTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 14,
    fontWeight: "800",
  },
  preferenceText: { color: colors.inkSoft, fontFamily: fontFamily.body, fontSize: 12 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  notesInput: {
    minHeight: 112,
    padding: 14,
    color: colors.ink,
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  characterCount: {
    marginTop: -6,
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 11,
    textAlign: "right",
  },
  error: {
    marginTop: -10,
    padding: 12,
    color: colors.danger,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    borderRadius: radii.sm,
    backgroundColor: colors.dangerSoft,
  },
  localNote: {
    marginTop: -14,
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
