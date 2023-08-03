import { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import PropTypes from "prop-types";

// This is a functional component representing an input field for a store.
export default function StoreInput({
  storeName,
  setStoreName,
  placeholder,
  icon,
  storeList,
}) {
  const [filteredStores, setFilteredStores] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (storeName && storeList) {
      // Filter stores that include the current input value
      const matches = storeList.filter((store) =>
        store.name.toLowerCase().startsWith(storeName.toLowerCase())
      );
      setFilteredStores(matches.slice(0, 1));
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  }, [storeList, storeName]);

  return (
    <View style={styles.container}>
      <Feather name={icon} size={24} color="black" />
      <TextInput
        onChangeText={setStoreName}
        value={storeName}
        placeholder={placeholder}
        style={styles.textInput}
      />
      {isDropdownVisible && (
        <FlatList
          data={filteredStores}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setStoreName(item.name);
                setFilteredStores([]);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}
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
    width: "100%",
    zIndex: 5,
  },
  textInput: {
    flex: 1,
    paddingVertical: 5,
    paddingLeft: 5,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
  },
  dropdownText: {
    padding: 5,
  },
});
StoreInput.propTypes = {
  storeName: PropTypes.string.isRequired,
  setStoreName: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.string,
  storeList: PropTypes.arrayOf(PropTypes.shape),
};

StoreInput.defaultProps = {
  icon: null,
  storeList: null,
};
