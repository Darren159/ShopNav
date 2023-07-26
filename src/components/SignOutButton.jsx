import { useContext } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../app/context/auth";

// The SignOutButton function component renders a button that allows the user to sign out of Developer Access page
export default function SignOutButton() {

  // Extract the signout function from the AuthContext.
  const { signout } = useContext(AuthContext);

  // Define the handleSignOut function which signs out the user and redirects them to the "/sign-in" page.
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
