import { useState, useEffect, useContext, useCallback } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { Stack } from "expo-router";
import { db } from "../../firebaseConfig";
import SearchBar from "../components/SearchBar";
import { MallContext } from "./context/mallProvider";
import StoreList from "../components/StoreList";

export default function StoreSearch() {
  const { currentMall } = useContext(MallContext);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);

  // for filtering search function
  const handleSearch = useCallback(
    (query) => {
      if (query) {
        const formattedQuery = query.toLowerCase();
        const filteredData = fullData.filter(
          (item) => item && item.name.toLowerCase().includes(formattedQuery)
        );
        setData(filteredData);

        // console.log(`Searching for ${query}`);
      } else {
        // If query is cleared, reset the data to the full list
        setData(fullData);
      }
    },
    [fullData]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "malls", currentMall, "stores");

        // await until data is fetched
        const storeListSnapShot = await getDocs(colRef);

        const storeList = storeListSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // console.log(storeList);
        // sorting the list by alphabets
        storeList.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );

        setFullData(storeList);

        // set data to full data set initially
        setData(storeList);
      } catch (err) {
        // console.error("Error fetching data: ", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (!data.length) {
      setIsLoading(true);
      fetchData();
    }
  }, [currentMall, data]);

  // loading interface
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  // error interface
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          Error in fetching data ... Please check your internet connection!
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: null,
        }}
      />
      <SafeAreaView style={styles.mainContainer}>
        {currentMall && (
          <View style={{ flex: 1, paddingBottom: 70 }}>
            <SearchBar onSearch={handleSearch} />
            <StoreList data={data} />
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
});
