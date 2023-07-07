import { View, Text, TextInput } from "react-native";
import PropTypes from "prop-types";

export default function StoreInput({
  storeName,
  setStoreName,
  error,
  placeholder,
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TextInput
        onChangeText={setStoreName}
        value={storeName}
        placeholder={placeholder}
        style={{
          height: 50,
          width: 150,
          borderColor: error ? "red" : "#000",
          borderWidth: 1,
        }}
      />
      {error && <Text style={{ color: "red" }}>Invalid store name</Text>}
    </View>
  );
}
StoreInput.propTypes = {
  storeName: PropTypes.string.isRequired,
  setStoreName: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
};
