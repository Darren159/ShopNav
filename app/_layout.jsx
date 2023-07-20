import { Tabs } from "expo-router";
import { MallProvider } from "../context/MallProvider";

export default function Layout() {
  return (
    <MallProvider>
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
    </MallProvider>
  );
}
