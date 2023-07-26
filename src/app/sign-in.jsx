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

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signin, user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (user) {
      // If `user` is not `null`, redirect the user to the developer access page
      router.replace("/developerAccess");
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signin(email, password);
    } catch (e) {
      Alert.alert("Sign In Error", "Invalid Email/Password", [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
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
