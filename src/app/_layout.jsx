import { Stack, Link } from "expo-router";
import { View, Button } from "react-native";
import { MallProvider } from "./context/mallProvider";
import { AuthProvider } from "./context/auth";
import MallPicker from "../components/MallPicker";

export default function Layout() {
  return (
    <AuthProvider>
      <MallProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#B6D0D0",
            },
            headerTitle: "",
            headerLeft: MallPicker,
            headerRight: DeveloperAccessButton,
            headerBackVisible: true,
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
    <View style={{ flexDirection: "row" }}>
      <Link href="/storeSearch" asChild>
        <Button title="Store Search" />
      </Link>
      <Link href="/(auth)/sign-in" asChild>
        <Button title="Developer Access" />
      </Link>
    </View>
  );
}
