import { useState, useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Stack } from "expo-router";
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

  useEffect(() => {
    const loadStores = async () => {
      try {
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
    <>
      <Stack.Screen
        options={{
          headerRight: null,
        }}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View>
          <SearchBar onSearch={setQuery} />
          {currentMall ? (
            <StoreList data={filteredData} />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5500dc" />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
