import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen name="Directory" />
      <Tabs.Screen name="Navigation" />
      <Tabs.Screen
        name="DeveloperAccess"
        options={{
          title: "Developer Access",
        }}
      />
    </Tabs>
  );
}
