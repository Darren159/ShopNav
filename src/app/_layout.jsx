import { Stack, Link } from "expo-router";
import { View } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
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
            headerRight: Icons,
            headerBackVisible: true,
          }}
        >
          <Stack.Screen
            name="storeDetails"
            options={{
              presentation: "modal",
            }}
          />
        </Stack>
      </MallProvider>
    </AuthProvider>
  );
}

function Icons() {
  return (
    <View style={{ flexDirection: "row" }}>
      <Link href="/storeSearch" asChild>
        <Ionicons name="search-outline" size={24} color="black" />
      </Link>
      <Link href="/(auth)/sign-in" asChild>
        <Ionicons name="hammer-outline" size={24} color="black" />
      </Link>
    </View>
  );
}
