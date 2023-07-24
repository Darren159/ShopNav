import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import PropTypes from "prop-types";

export default function StoreInput({
  storeName,
  setStoreName,
  placeholder,
  icon,
}) {
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
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    paddingLeft: 5,
  },
});
StoreInput.propTypes = {
  storeName: PropTypes.string.isRequired,
  setStoreName: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

StoreInput.defaultProps = {
  icon: null,
};
