import { useState, useContext, useEffect } from "react";
import { Stack, router } from "expo-router";
import {
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "./context/auth";

// The SignIn function component provides a user interface and functionality for user authentication.
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signin, user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  // UseEffect to track the 'user' state.
  // If a user is authenticated, it will redirect the user to the developer access page.
  useEffect(() => {
    if (user) {
      // If `user` is not `null`, redirect the user to the developer access page
      router.replace("/developerAccess");
    }
  }, [user]);

  // Async function to handle sign in action.
  // If email and password are valid, it will call the 'signin' function from AuthContext.
  // It also manages loading state and displays an error alert on failure.
  const handleSignIn = async () => {
    try {
      // Set loading to true as sign in process starts.
      setIsLoading(true);

      // Call signin function with entered email and password.
      await signin(email, password);
    } catch (e) {
      // On catch, alert the user with an error message.
      Alert.alert("Sign In Error", "Invalid Email/Password", [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      // Once sign in process ends, set loading to false.
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: null,
        }}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCompleteType="password"
          textContentType="password"
        />
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#5500dc"
            style={styles.loadingContainer}
            testID="loading"
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={{ color: "white" }}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    width: "80%",
    padding: 10,
    textAlign: "left",
    marginBottom: 5,
  },
  loadingContainer: { marginTop: 12 },
  button: {
    width: "80%",
    marginTop: 10,
    padding: 10,
    borderColor: "grey",
    backgroundColor: "#8AB9EF",
    borderRadius: 10,
    alignItems: "center",
  },
});
