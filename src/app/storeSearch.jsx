import { useState, useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  View,
} from "react-native";
import SearchBar from "../components/SearchBar";
import StoreList from "../components/StoreList";
import CategoryPicker from "../components/CategoryPicker";
import { MallContext } from "./context/mallProvider";
import fetchStoreList from "../services/fetchStoreList";
import handleSearch from "../utils/handleSearch";

// The StoreSearch function component displays a list of stores in a specific mall.
// It also provides a search functionality to filter the list of stores based on a search query.
export default function StoreSearch() {
  const { currentMall } = useContext(MallContext);
  const [query, setQuery] = useState("");
  const [fullData, setFullData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch the list of stores for the current mall when the mall changes
  useEffect(() => {
    const loadStores = async () => {
      try {
        // Set loading state to true while fetching data.
        setIsLoading(true);

        // Fetch the list of stores in the current mall.
        const storeList = await fetchStoreList(currentMall);

        if (storeList) {
          // If the store list is not null or undefined, sort it by store name and update the state.
          storeList.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );

          setFullData(storeList);
          setFilteredData(storeList);
        }
      } catch (error) {
        // If an error occurs, show an alert with the error message.
        Alert.alert("Error", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      } finally {
        // Set loading state to false after fetching data.
        setIsLoading(false);
      }
    };
    if (currentMall) {
      // If a mall is currently selected, load the stores for that mall.
      loadStores();
    }
  }, [currentMall]);

  useEffect(() => {
    if (query || selectedCategory) {
      setFilteredData(handleSearch(fullData, query, selectedCategory));
    } else {
      setFilteredData(fullData);
    }
  }, [query, fullData, selectedCategory]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.searchContainer}>
        <SearchBar onSearch={setQuery} />
        <CategoryPicker
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#5500dc"
          style={styles.loadingContainer}
          testID="loading"
        />
      ) : (
        <StoreList data={filteredData} />
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
