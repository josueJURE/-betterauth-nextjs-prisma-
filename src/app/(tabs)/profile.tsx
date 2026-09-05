import { useEffect, useMemo, useState } from "react";
import { Database, Leaf, Save, ShieldCheck, Sparkles } from "lucide-react-native";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { AppScreen } from "@/components/ui/app-screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { colors, radii } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";
import { preferencesSchema } from "@/validation/schemas";

export default function ProfileScreen() {
  const preferences = useAppStore((state) => state.preferences);
  const recipes = useAppStore((state) => state.recipes);
  const mealPlans = useAppStore((state) => state.mealPlans);
  const updatePreferences = useAppStore((state) => state.updatePreferences);
  const [name, setName] = useState(preferences.name);
  const [vegan, setVegan] = useState(preferences.vegan);
  const [glutenFree, setGlutenFree] = useState(preferences.glutenFree);
  const [dietaryNotes, setDietaryNotes] = useState(preferences.dietaryNotes);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(preferences.name);
    setVegan(preferences.vegan);
    setGlutenFree(preferences.glutenFree);
    setDietaryNotes(preferences.dietaryNotes);
  }, [preferences]);

  const stats = useMemo(
    () => [
      { value: recipes.filter((recipe) => recipe.isFavorite).length, label: "Saved" },
      { value: recipes.filter((recipe) => recipe.isCooked).length, label: "Cooked" },
      { value: mealPlans.length, label: "Planned" },
    ],
    [mealPlans.length, recipes],
  );

  const handleSave = async () => {
    const result = preferencesSchema.safeParse({ name, vegan, glutenFree, dietaryNotes });
    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? "Check your details");
      return;
    }

    setSaving(true);
    try {
      await updatePreferences(result.data);
      setMessage("Preferences saved");
    } catch {
      setMessage("We couldn't save those preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppScreen contentContainerStyle={styles.screen}>
      <View>
        <Text style={styles.eyebrow}>YOUR KITCHEN</Text>
        <Text style={styles.title}>Profile & preferences</Text>
      </View>

      <View style={styles.profileHero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(name.trim().charAt(0) || "F").toUpperCase()}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>{name || "Food explorer"}</Text>
          <Text style={styles.profileCaption}>Local culinary profile</Text>
        </View>
        <Sparkles color={colors.gold} size={22} />
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <Card key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About you</Text>
        <Card style={styles.formCard}>
          <Text style={styles.label}>DISPLAY NAME</Text>
          <TextInput
            maxLength={60}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#969D98"
            style={styles.input}
            value={name}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary defaults</Text>
        <Card style={styles.preferenceCard}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceIcon}>
              <Leaf color={colors.sage} size={21} />
            </View>
            <View style={styles.preferenceCopy}>
              <Text style={styles.preferenceTitle}>Plant-based</Text>
              <Text style={styles.preferenceText}>Default new recipes to vegan.</Text>
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
              <Text style={styles.preferenceText}>Use compatible swaps by default.</Text>
            </View>
            <Switch
              onValueChange={setGlutenFree}
              thumbColor={colors.white}
              trackColor={{ false: "#C9CDC9", true: colors.sage }}
              value={glutenFree}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.notesBlock}>
            <Text style={styles.label}>DIETARY NOTES</Text>
            <TextInput
              maxLength={180}
              multiline
              onChangeText={setDietaryNotes}
              placeholder="Allergies or ingredients to avoid"
              placeholderTextColor="#969D98"
              style={[styles.input, styles.notesInput]}
              textAlignVertical="top"
              value={dietaryNotes}
            />
          </View>
        </Card>
      </View>

      {message ? (
        <Text style={message === "Preferences saved" ? styles.success : styles.error}>
          {message}
        </Text>
      ) : null}

      <Button
        fullWidth
        icon={<Save color={colors.white} size={18} />}
        label="Save preferences"
        loading={saving}
        onPress={() => void handleSave()}
      />

      <Card style={styles.privacyCard}>
        <View style={styles.databaseIcon}>
          <Database color={colors.sage} size={22} />
        </View>
        <View style={styles.privacyCopy}>
          <Text style={styles.privacyTitle}>Local-first by design</Text>
          <Text style={styles.privacyText}>
            Recipes, plans, and preferences live in SQLite on this device. No passwords or API keys are stored.
          </Text>
        </View>
      </Card>
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
  profileHero: {
    minHeight: 92,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderRadius: radii.lg,
    backgroundColor: colors.ink,
  },
  avatar: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  avatarText: {
    color: colors.white,
    fontFamily: fontFamily.display,
    fontSize: 26,
    fontWeight: "700",
  },
  profileCopy: { flex: 1, gap: 3 },
  profileName: {
    color: colors.white,
    fontFamily: fontFamily.display,
    fontSize: 21,
    fontWeight: "700",
  },
  profileCaption: { color: "#C8D4CB", fontFamily: fontFamily.body, fontSize: 12 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, padding: 12, alignItems: "center", gap: 2 },
  statValue: {
    color: colors.primary,
    fontFamily: fontFamily.display,
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: { color: colors.inkSoft, fontFamily: fontFamily.bodyMedium, fontSize: 11 },
  section: { gap: 11 },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fontFamily.display,
    fontSize: 21,
    fontWeight: "700",
  },
  formCard: { gap: 8 },
  label: {
    color: colors.inkSoft,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 13,
    color: colors.ink,
    fontFamily: fontFamily.body,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
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
  notesBlock: { paddingVertical: 14, gap: 8 },
  notesInput: { minHeight: 82, paddingTop: 12 },
  success: {
    padding: 11,
    color: colors.sage,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    borderRadius: radii.sm,
    backgroundColor: colors.sageSoft,
    textAlign: "center",
  },
  error: {
    padding: 11,
    color: colors.danger,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    borderRadius: radii.sm,
    backgroundColor: colors.dangerSoft,
    textAlign: "center",
  },
  privacyCard: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  databaseIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.sageSoft,
  },
  privacyCopy: { flex: 1, gap: 4 },
  privacyTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 14,
    fontWeight: "800",
  },
  privacyText: {
    color: colors.inkSoft,
    fontFamily: fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
  },
});
