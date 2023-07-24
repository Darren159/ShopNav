import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";

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
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#5500dc" />
    </View>
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
