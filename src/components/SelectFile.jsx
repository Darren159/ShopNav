import { TouchableOpacity, View, Text, Alert, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export default function SelectFile({ title, onPress }) {
  const handlePress = async () => {
    try {
      await onPress();
    } catch (error) {
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
