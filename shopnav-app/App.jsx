import React from "react";
import { View, StyleSheet } from "react-native";
import Directory from "./components/Directory";

export default function App() {
  return (
    <View style={styles.container}>
      <Directory />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
