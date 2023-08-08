import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// The SearchBar function component renders a search bar that allows the user to enter a search query. Used for Store Search page here
export default function SearchBar({ onSearch }) {
  // Define the searchQuery state and its corresponding setter function.
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={{ flex: 1 }}>
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
