import { Stack } from "expo-router";
import { MallProvider } from "../context/MallProvider";

export default function Layout() {
  return (
    <MallProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4340DF",
          },
          headerTitle: "",
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
