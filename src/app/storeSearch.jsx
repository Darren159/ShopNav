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

export default function StoreSearch() {
  const { currentMall } = useContext(MallContext);
  const [query, setQuery] = useState("");
  const [fullData, setFullData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStores = async () => {
      try {
        setIsLoading(true);
        const storeList = await fetchStoreList(currentMall);
        if (storeList) {
          storeList.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );
          setFullData(storeList);
          setFilteredData(storeList);
        }
      } catch (error) {
        Alert.alert("Error", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (currentMall) {
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
