import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Alert,
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={{
          width: 300,
          padding: 10,
          marginTop: 30,
          borderColor: "grey",
          backgroundColor: "#B6D0D0",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}> {title} </Text>
      </View>
    </TouchableOpacity>
  );
}

UploadButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
