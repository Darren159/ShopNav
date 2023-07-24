import { Stack, Link } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MallProvider } from "./context/mallProvider";
import { AuthProvider } from "./context/auth";
import MallPicker from "../components/MallPicker";
import SignOutButton from "../components/SignOutButton";

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

            headerBackVisible: true,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerLeft: MallPicker,
              headerRight: Icons,
            }}
          />
          <Stack.Screen
            name="storeSearch"
            options={{
              headerLeft: MallPicker,
            }}
          />
          <Stack.Screen
            name="storeDetails"
            options={{
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="(auth)/developerAccess"
            options={{
              headerRight: SignOutButton,
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
        <Ionicons
          name="hammer-outline"
          size={24}
          color="black"
          style={{ paddingLeft: 10 }}
        />
      </Link>
    </View>
  );
}
