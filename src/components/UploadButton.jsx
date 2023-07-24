import { useState } from "react";
import { TouchableOpacity, View, Text, Alert, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Loader from "./Loader";

export default function UploadButton({ title, onPress }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);

    try {
      await onPress();
      Alert.alert("Success", "Upload successful!");
    } catch (error) {
      Alert.alert(
        `Error in ${title}`,
        error.message === "Invalid Store Name"
          ? error.message
          : `Failed to ${title}`,
        [
          {
            text: "Ok",
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.button}>
        <Text style={{ color: "white" }}> {title} </Text>
      </View>
    </TouchableOpacity>
  );
}

UploadButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  loadingContainer: { padding: 5 },
  button: {
    width: 300,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "grey",
    backgroundColor: "#8AB9EF",
    alignItems: "center",
  },
});
