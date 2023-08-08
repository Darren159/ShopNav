import { useState, useEffect, useRef } from "react";
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

  const hasSelectedStoreRef = useRef(false);

  useEffect(() => {
    if (storeName && storeList) {
      // Filter stores that include the current input value
      const matches = storeList.filter((store) =>
        store.name.toLowerCase().startsWith(storeName.toLowerCase())
      );
      setFilteredStores(matches);
      if (hasSelectedStoreRef.current) {
        // If a selection has just been made, hide the dropdown
        setDropdownVisible(false);
        hasSelectedStoreRef.current = false; // Reset the selection flag
      } else {
        // Otherwise, show the dropdown
        setDropdownVisible(matches.length > 0);
      }
    } else {
      setDropdownVisible(false);
    }
  }, [storeList, storeName]);
  return (
    <View>
      <View style={styles.inputContainer}>
        <Feather name={icon} size={24} color="black" />
        <TextInput
          onChangeText={setStoreName}
          value={storeName}
          placeholder={placeholder}
          style={styles.textInput}
        />
      </View>
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredStores}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setStoreName(item.name);
                  hasSelectedStoreRef.current = true;
                }}
              >
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 5,
    backgroundColor: "#fff",
    width: "100%",
  },
  textInput: {
    paddingVertical: 5,
    paddingLeft: 5,
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    zIndex: 5,
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
  storeList: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

StoreInput.defaultProps = {
  icon: null,
};
