import { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import PropTypes from "prop-types";

// The CategoryPicker function component allows the user to select a category from a dropdown menu.
export default function CategoryPicker({
  selectedCategory,
  setSelectedCategory,
}) {
  // State to control the visibility of the modal.
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    setSelectedCategory(value); // Set the current category.
    setModalVisible(false); // Close the modal.
  };

  const handleClear = () => {
    setSelectedCategory(""); // Clear the selected category
  };

  const categories = [
    "Beauty & Wellness",
    "Books & Stationery",
    "Children",
    "Department Store & Value Store",
    "Electronics & Technology",
    "Fashion",
    "Food & Beverage",
    "Hobbies & Leisure",
    "Home & Furnishing",
    "Services",
    "Sports",
    "Supermarket & Speciality Mart",
  ];

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <Text>{selectedCategory || "Select a Category"}</Text>
        <Entypo name="chevron-thin-down" size={24} color="grey" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ opacity: selectedCategory ? 1 : 0 }}
        onPress={handleClear}
        disabled={!selectedCategory}
      >
        <Entypo name="cross" size={24} color="grey" />
      </TouchableOpacity>
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.textContainer}
              onPress={() => handleSelect(category)}
            >
              <View style={styles.textContainer}>
                <Text style={styles.button}>{category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  container: {
    height: 40,
    width: 175,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ECEEF0",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: { marginLeft: 10 },
  textContainer: {
    height: 40,
    width: 300,
    borderWidth: 0.5,
    justifyContent: "center",
    backgroundColor: "white",
  },
});

CategoryPicker.propTypes = {
  selectedCategory: PropTypes.string,
  setSelectedCategory: PropTypes.func.isRequired,
};

CategoryPicker.defaultProps = {
  selectedCategory: "",
};
