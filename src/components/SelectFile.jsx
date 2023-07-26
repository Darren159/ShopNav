import { TouchableOpacity, View, Text, Alert, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// The SelectFile function component renders a button that allows the user to select a file.
export default function SelectFile({ title, onPress }) {

  // Define the handlePress function which calls the onPress function passed as prop and handles potential errors.
  const handlePress = async () => {
    try {

      // Call the onPress function asynchronously
      await onPress();

      
    } catch (error) {
      // If an error is caught, an alert will be shown with the title "Error" and the message "Invalid File"
      Alert.alert(`Error`, "Invalid File", [
        {
          text: "Ok",
        },
      ]);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.button}>
        <Text style={{ color: "white" }}> {title} </Text>
      </View>
    </TouchableOpacity>
  );
}

SelectFile.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
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
