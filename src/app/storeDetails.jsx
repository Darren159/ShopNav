import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Entypo, FontAwesome, Feather } from "@expo/vector-icons";
import fetchImage from "../services/fetchImage";
import fetchPlaceId from "../services/fetchPlaceId";
import fetchPlaceDetails from "../services/fetchPlaceDetails";
import StarRating from "../components/StarRating";

export default function StoreDetails() {
  // collapsible opening hours
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handlePress = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [placeDetails, setPlaceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // check locName is the name of the item user pressed
  const { locName } = useLocalSearchParams();
  // console.log(locName);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        // get place_Id using google places API
        const placeId = await fetchPlaceId(locName);

        // using place_Id to get unique place details
        const results = await fetchPlaceDetails(placeId);
        results.opening_hours.weekday_text =
          results.opening_hours.weekday_text.map((text, index) => ({
            text,
            id: `text-${index}`,
          }));

        setPlaceDetails(results);
        setIsLoading(false);
        // check results obtained
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [locName]);

  // console.log(placeDetails);

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
  if (placeDetails != null) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: null,
            headerLeft: null,
          }}
        />
        <SafeAreaView style={styles.mainContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.placeName}>{placeDetails.name}</Text>

            <FlatList
              data={placeDetails.photos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: fetchImage(item.photo_reference) }}
                  style={styles.googleImage}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={
                styles.googleImage.width + 2 * styles.googleImage.margin
              }
              snapToAlignment="center"
            />

            <View style={styles.detailsContainer}>
              <FontAwesome name="map-marker" size={24} color="grey" />

              <Text style={styles.formattedAddressText}>
                {placeDetails.formatted_address}
              </Text>

              <Text style={styles.ratingText}>{placeDetails.rating} </Text>
              <FontAwesome name="star" size={24} color="#FDCC0D" />
            </View>

            <View style={styles.detailsContainer}>
              <FontAwesome
                name={
                  placeDetails.business_status === "OPERATIONAL"
                    ? "check-circle"
                    : "times-circle"
                }
                size={24}
                color={
                  placeDetails.business_status === "OPERATIONAL"
                    ? "green"
                    : "red"
                }
              />
              <Text
                style={[
                  styles.details,
                  {
                    color:
                      placeDetails.business_status === "OPERATIONAL"
                        ? "green"
                        : "red",
                  },
                ]}
              >
                {placeDetails.business_status.charAt(0) +
                  placeDetails.business_status.slice(1).toLowerCase()}
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              <FontAwesome name="phone" size={24} color="grey" />
              <Text style={styles.details}>
                {placeDetails.formatted_phone_number}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handlePress}
              style={styles.detailsContainer}
            >
              <Feather name="clock" size={24} color="grey" />
              <Text style={styles.details}>Operating Hours:</Text>
              <Text
                style={[
                  styles.details,
                  { paddingLeft: 5 },
                  {
                    color: placeDetails.opening_hours.open_now
                      ? "green"
                      : "red",
                  },
                ]}
              >
                {placeDetails.opening_hours.open_now ? "Open" : "Closed"}
              </Text>
              <Entypo
                name={isCollapsed ? "chevron-thin-down" : "chevron-thin-up"}
                size={24}
                color="grey"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
            {!isCollapsed &&
              placeDetails.opening_hours.weekday_text.map((item) => (
                <View style={{ padding: 5, paddingLeft: 45 }} key={item.id}>
                  <Text>{item.text}</Text>
                </View>
              ))}
            <View style={[styles.detailsContainer, { borderBottomWidth: 0 }]}>
              <FontAwesome name="commenting" size={24} color="grey" />
              <Text style={styles.details}>Reviews:</Text>
            </View>

            <FlatList
              data={placeDetails.reviews}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Image
                    style={{ height: 75, width: 75 }}
                    source={{ uri: item.profile_photo_url }}
                  />
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {item.author_name}
                  </Text>
                  <Text>{item.relative_time_description}</Text>
                  <StarRating rating={item.rating} />

                  <Text>{item.text}</Text>
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              decelerationRate="fast"
              snapToInterval={
                styles.itemContainer.width + 2 * styles.itemContainer.margin
              }
              snapToAlignment="center"
            />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  itemContainer: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: 300,
    margin: 5,
  },
  placeName: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  googleImage: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    margin: 5,
  },
  detailsContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 0.2,
  },
  formattedAddressText: {
    flex: 0.8,
    paddingLeft: 10,
  },
  ratingText: {
    flex: 0.2,
    fontSize: 24,
    textAlign: "right",
  },
  details: {
    paddingLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
});
