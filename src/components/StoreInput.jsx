import { View, Text, TextInput } from "react-native";
import PropTypes from "prop-types";

export default function StoreInput({
  storeName,
  setStoreName,
  error,
  placeholder,
}) {
  return (
    <View>
      <TextInput
        onChangeText={setStoreName}
        value={storeName}
        placeholder={placeholder}
        style={{  
          borderColor: error ? "red" : "#000", paddingLeft: 10
        }}
      />
      {error && <Text style={{ color: "red", paddingLeft:10 }}>Invalid store name</Text>}
    </View>
  );
}
StoreInput.propTypes = {
  storeName: PropTypes.string.isRequired,
  setStoreName: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
};
