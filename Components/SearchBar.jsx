import { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import PropTypes from "prop-types";

export default function SearchBar( {onSearch} ) {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (query) => {
      setSearchQuery(query);
      // Call the onSearch prop when the user presses the search button
      onSearch(query);
    };


  return (
    <View>
      <TextInput 
        style = {styles.searchBar}
        placeholder = "Search..."
        clearButtonMode = "always"
        autoCapitalize = "none"
        autoCorrect = {false}
        value = {searchQuery}
        onChangeText = { (query) => handleSearch(query)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderColor: "#ccc",
    borderWidth: 1, 
    borderRadius: 8 , 
    height: 40,
  },

})

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
}