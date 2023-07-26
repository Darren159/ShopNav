import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Entypo, FontAwesome, Feather } from "@expo/vector-icons";
import fetchPlaceId from "../services/fetchPlaceID";
import fetchPlaceDetails from "../services/fetchPlaceDetails";
import ImageCarousel from "../components/ImageCarousel";
import ReviewCarousel from "../components/ReviewCarousel";

// The StoreDetails function component provides detailed information about a specific store,
// such as name, address, rating, business status, phone number, operating hours, reviews, etc.
export default function StoreDetails() {

  // collapsible opening hours
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Toggles the state of the opening hours' collapsed or expanded view.
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // The detailed information of the place (store).
  const [placeDetails, setPlaceDetails] = useState(null);

  // The name of the location (store) the user selected, promo information and store name.
  const { locName, promoInfo, storeName } = useLocalSearchParams();

  // Fetch the details of the store when the location name changes.
  useEffect(() => {
    const fetchDetails = async () => {
      try {

        // Get place_Id using google places API
        const placeId = await fetchPlaceId(locName);

        // Using place_Id to get unique place details
        const results = await fetchPlaceDetails(placeId);

        // Store the details of the place.
        setPlaceDetails(results);
      } catch (error) {

        // If an error occurs, display an alert with the error message.
        Alert.alert("Error", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    };

    // Fetch the details.
    fetchDetails();
  }, [locName]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      {!placeDetails ? (
        <ActivityIndicator
          size="large"
          color="#5500dc"
          style={styles.loadingContainer}
          testID="loading"
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.placeName}>{storeName}</Text>
          {placeDetails.photos && (
            <ImageCarousel photos={placeDetails.photos} />
          )}
          <View style={styles.detailsContainer}>
            <FontAwesome name="map-marker" size={24} color="grey" />
            <Text style={styles.formattedAddressText}>
              {placeDetails.formatted_address}
            </Text>
            <Text style={styles.ratingText}>{placeDetails.rating} </Text>
            <FontAwesome name="star" size={24} color="#FDCC0D" />
          </View>
          {placeDetails.business_status && (
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
          )}
          {placeDetails.formatted_phone_number && (
            <View style={styles.detailsContainer}>
              <FontAwesome name="phone" size={24} color="grey" />
              <Text style={styles.details}>
                {placeDetails.formatted_phone_number}
              </Text>
            </View>
          )}
          {placeDetails.opening_hours && (
            <TouchableOpacity
              onPress={toggleCollapse}
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
          )}

          {!isCollapsed &&
            placeDetails.opening_hours.weekday_text.map((item) => (
              <View style={{ padding: 5, paddingLeft: 45 }} key={item}>
                <Text>{item}</Text>
              </View>
            ))}
          {promoInfo ? (
            <View style={styles.detailsContainer}>
              <FontAwesome name="tags" size={24} color="grey" />
              <Text style={styles.details}>{promoInfo}</Text>
            </View>
          ) : null}
          {placeDetails.reviews && (
            <>
              <View style={[styles.detailsContainer, { borderBottomWidth: 0 }]}>
                <FontAwesome name="commenting" size={24} color="grey" />
                <Text style={styles.details}>Reviews:</Text>
              </View>
              <ReviewCarousel reviews={placeDetails.reviews} />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1 },
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  placeName: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
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
