import { useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";

  // This is a functional component representing a button used to upload data.
export default function UploadButton({ title, onPress }) {
  
  // isLoading is a state variable that indicates whether the upload is in progress.
  // setIsLoading is a function to set the isLoading state.
  const [isLoading, setIsLoading] = useState(false);

  // handlePress is an async function that handles the button press.
  const handlePress = async () => {
    // Set isLoading to true to indicate that the upload has started.
    setIsLoading(true);

    try {

      // Call the onPress function that was passed as a prop. This is expected to be a function that handles the upload process.
      await onPress();
      
      // If the upload is successful, display an alert saying so.
      Alert.alert("Success", "Upload successful!");
    } catch (error) {
      // If an error is encountered during the upload process, display an alert with the error message.
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
      // Whether the upload was successful or an error was encountered, set isLoading to false to indicate that the upload process has ended.
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#5500dc"
      style={styles.loadingContainer}
    />
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
