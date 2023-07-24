import { useContext } from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../app/context/auth";

export default function SignOutButton() {
  const { signout } = useContext(AuthContext);
  const handleSignOut = async () => {
    await signout();
    router.replace("/sign-in");
  };
  <TouchableOpacity
    onPress={handleSignOut}
    style={{
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: "white",
    }}
  >
    <Image
      style={{ height: 40, width: 40 }}
      source={{
        uri: "https://th.bing.com/th/id/OIP.kEapEfmfmXwTkw5mILXfHQHaHa?w=202&h=202&c=7&r=0&o=5&pid=1.7",
      }}
    />
    <Text> Sign Out </Text>
  </TouchableOpacity>;
}
