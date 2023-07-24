import { useState, useContext, useEffect } from "react";
import { Stack, router } from "expo-router";
import { View, TextInput, Alert, TouchableOpacity, Text } from "react-native";
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
      <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>

        <View style = {{ borderBottomWidth: 0.3, width: 300, padding: 10}}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>

        <View style = {{ borderBottomWidth: 0.3, width: 300, padding: 10}}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCompleteType="password"
            textContentType="password"
          />
        </View>

        <View style = {{ width: 300, padding: 10, marginTop: 30, borderColor: 'grey', backgroundColor: '#B6D0D0' , justifyContent:'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleSignIn} >
            <Text style = {{ color: 'white'}}> Sign In</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </>
  );
}
