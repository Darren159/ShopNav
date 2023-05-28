import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";

export default function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get("http://10.0.2.2:3000")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>{data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
