import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        clearButtonMode="always"
        autoCapitalize="none"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={(query) => {
          setSearchQuery(query);
          onSearch(query);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 10,
    paddingLeft: 10,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
  },
});

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
