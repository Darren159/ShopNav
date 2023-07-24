import { TouchableOpacity, View, Text, Alert } from "react-native";
import PropTypes from "prop-types";

export default function UploadButton({ title, onPress }) {
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
      <View
        style={{
          width: 300,
          padding: 10,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "grey",
          backgroundColor: "#8AB9EF",
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
