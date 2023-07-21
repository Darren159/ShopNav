import { Stack, Link } from "expo-router";
import { Button } from "react-native";
import { MallProvider } from "./context/MallProvider";

export default function Layout() {
  return (
    <MallProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4340DF",
          },
          headerTitle: "",
          headerRight: DeveloperAccessButton,
        }}
      >
        <Stack.Screen
          name="placeDetails"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </MallProvider>
  );
}

function DeveloperAccessButton() {
  return (
    <Link href="/developerAccess" asChild>
      <Button title="Developer Access" />
    </Link>
  );
}
