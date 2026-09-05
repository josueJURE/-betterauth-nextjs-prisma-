import { Tabs } from "expo-router";
import {
  Bookmark,
  CalendarDays,
  Compass,
  Home,
  UserRound,
  type LucideIcon,
} from "lucide-react-native";
import type { ColorValue } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";

function tabIcon(Icon: LucideIcon) {
  function TabBarIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Icon color={color as string} size={size} strokeWidth={2.2} />;
  }

  TabBarIcon.displayName = `${Icon.displayName ?? "Icon"}TabBarIcon`;
  return TabBarIcon;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontFamily: fontFamily.bodyMedium,
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon(Home) }}
      />
      <Tabs.Screen
        name="discover"
        options={{ title: "Discover", tabBarIcon: tabIcon(Compass) }}
      />
      <Tabs.Screen
        name="planner"
        options={{ title: "Planner", tabBarIcon: tabIcon(CalendarDays) }}
      />
      <Tabs.Screen
        name="saved"
        options={{ title: "Saved", tabBarIcon: tabIcon(Bookmark) }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: tabIcon(UserRound) }}
      />
    </Tabs>
  );
}
