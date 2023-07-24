import { useContext } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../app/context/auth";

export default function SignOutButton() {
  const { signout } = useContext(AuthContext);

  const handleSignOut = async () => {
    await signout();
    router.replace("/sign-in");
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <View style={styles.button}>
        <Text style={{ color: "white" }}> Logout </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "grey",
    padding: 5,
    backgroundColor: "#5C9AE2",
  },
});
