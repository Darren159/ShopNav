import { useState, useContext, useEffect } from "react";
import { Stack, router } from "expo-router";
import { View, TextInput, Button, Alert } from "react-native";
import { AuthContext } from "../context/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signin, user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      // If `user` is not `null`, redirect the user to the developer access page
      router.replace("/developerAccess");
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signin(email, password);
    } catch (e) {
      Alert.alert("Sign In Error", e.message, [{ text: "OK" }], {
        cancelable: false,
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: null,
        }}
      />
      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCompleteType="password"
          textContentType="password"
        />
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
    </>
  );
}
