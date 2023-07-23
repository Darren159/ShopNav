import { useEffect } from "react";
import { View, TextInput, Alert, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import PropTypes from "prop-types";

export default function StoreInput({
  storeName,
  setStoreName,
  error,
  placeholder,
  icon,
}) {
  // handle wrong input error
  useEffect(() => {
    // only show the Alert once
    if (error) {
      Alert.alert(
        "Invalid Store Input",
        "Try re-typing the store inputs, make sure that there are no symbols used, and double check your spacings",
        [
          {
            text: "OK",
            onPress: () => {
              // console.log(" ok, close storeInput error ");
            },
          },
        ]
      );
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Feather name={icon} size={24} color="black" />
      <TextInput
        onChangeText={setStoreName}
        value={storeName}
        placeholder={placeholder}
        style={styles.textInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 5,
  },
});
StoreInput.propTypes = {
  storeName: PropTypes.string.isRequired,
  setStoreName: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
