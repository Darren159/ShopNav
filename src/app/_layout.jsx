import { Stack, Link } from "expo-router";
import { Button } from "react-native";
import { MallProvider } from "./context/mallProvider";
import { AuthProvider } from "./context/auth";

export default function Layout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

function DeveloperAccessButton() {
  return (
    <Link href="/(auth)/sign-in" asChild>
      <Button title="Developer Access" />
    </Link>
  );
}
