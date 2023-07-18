import { Stack } from "expo-router";


export default function RootLayout() {
    return (
     <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
            name = "PlaceDetailsScreen"
            options= {{
                presentation: 'modal',
            }}
            />
     </Stack>
    )
}