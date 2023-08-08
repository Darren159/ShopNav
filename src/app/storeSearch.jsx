import { useState, useContext, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  View,
} from "react-native";
import SearchBar from "../components/SearchBar";
import StoreList from "../components/StoreList";
import CategoryPicker from "../components/CategoryPicker";
import { MallContext } from "./context/mallProvider";
import handleSearch from "../utils/handleSearch";

// The StoreSearch function component displays a list of stores in a specific mall.
// It also provides a search functionality to filter the list of stores based on a search query.
export default function StoreSearch() {
  const { storeList } = useContext(MallContext);
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const sortedStores = [...storeList];

    if (sortedStores) {
      // Sort the local copy of the store list by store name.
      sortedStores.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    }
    if (query || selectedCategory) {
      setFilteredData(handleSearch(sortedStores, query, selectedCategory));
    } else {
      setFilteredData(sortedStores);
    }
  }, [query, storeList, selectedCategory]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.searchContainer}>
        <SearchBar onSearch={setQuery} />
        <CategoryPicker
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </View>
      {storeList ? (
        <StoreList data={filteredData} />
      ) : (
        <ActivityIndicator
          size="large"
          color="#5500dc"
          style={styles.loadingContainer}
          testID="loading"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
});
