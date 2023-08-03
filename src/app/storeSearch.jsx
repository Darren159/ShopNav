import { useState, useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import SearchBar from "../components/SearchBar";
import { MallContext } from "./context/mallProvider";
import StoreList from "../components/StoreList";
import fetchStoreList from "../services/fetchStoreList";
import handleSearch from "../utils/handleSearch";

// The StoreSearch function component displays a list of stores in a specific mall.
// It also provides a search functionality to filter the list of stores based on a search query.
export default function StoreSearch() {
  const { currentMall } = useContext(MallContext); // The current mall context.
  const [query, setQuery] = useState(""); // The search query.
  const [fullData, setFullData] = useState([]); // The complete list of stores.
  const [filteredData, setFilteredData] = useState([]); // The list of stores after applying the search filter.
  const [isLoading, setIsLoading] = useState(false); // A flag indicating whether the component is currently loading data.export default function StoreSearch() {

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
    if (query) {
      setFilteredData(handleSearch(fullData, query));
    } else {
      setFilteredData(fullData);
    }
  }, [query, fullData]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <SearchBar onSearch={setQuery} />
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
  loadingContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
});
