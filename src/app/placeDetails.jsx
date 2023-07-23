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
import { useLocalSearchParams } from "expo-router";
import googleImg from "../services/googleImg";
import googleCall from "../services/google_API_call";
import fetchPlaceDetails from "../services/fetchPlaceDetails";

export default function PlaceDetails() {
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
        // get placce_Id using google places API
        const placeId = await googleCall(locName);

        // using place_Id to get unique place details
        const results = await fetchPlaceDetails(placeId);

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
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.placeName}>{placeDetails.name}</Text>

          <FlatList
            style={styles.googleImgContainer}
            data={placeDetails.photos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                <Image
                  source={{ uri: googleImg(item.photo_reference) }}
                  style={styles.googleImage}
                />
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
          />

          <View style={styles.formattedAddressContainer}>
            <Image
              style={styles.formattedAddressIcon}
              source={{
                uri: "https://cdn3.iconfinder.com/data/icons/flat-pro-basic-set-1-1/32/location-gray-512.png",
              }}
            />

            <Text style={styles.formattedAddressText}>
              {placeDetails.formatted_address}
            </Text>

            <Text style={styles.ratingText}>{placeDetails.rating} ⭐</Text>
          </View>

          <View style={styles.businessStatusContainer}>
            <Text
              style={[
                styles.businessStatusText,
                {
                  color:
                    placeDetails.business_status === "OPERATIONAL"
                      ? "green"
                      : "red",
                },
              ]}
            >
              {placeDetails.business_status}
            </Text>
          </View>

          <View style={{ borderTopWidth: 0.2, padding: 10 }}>
            <Text
              style={{
                paddingLeft: 35,
                fontSize: 25,
                fontWeight: "bold",
                color: placeDetails.opening_hours.open_now ? "green" : "red",
              }}
            >
              {placeDetails.opening_hours.open_now ? "OPEN" : "CLOSED"}
            </Text>
          </View>

          <View
            style={{
              padding: 10,
              borderTopWidth: 0.2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{ height: 25, width: 25 }}
              source={{
                uri: "https://th.bing.com/th?id=OIP.K1oS9ypne1epe_3H9nahtAHaIS&w=236&h=264&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
              }}
            />
            <Text style={{ fontSize: 25, fontWeight: "bold", paddingLeft: 10 }}>
              {placeDetails.formatted_phone_number}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handlePress}
            style={{ padding: 10, flexDirection: "row", borderTopWidth: 0.2 }}
          >
            <Image
              style={{ height: 25, width: 25 }}
              source={{
                uri: "https://frameandkeyrealestate.files.wordpress.com/2019/04/clock-icon.png",
              }}
            />
            <Text
              style={{
                flex: 4,
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 25,
              }}
            >
              OPENING HOURS:
            </Text>
            <Text style={{ flex: 1, textAlign: "right", fontSize: 25 }}>
              {" "}
              {isCollapsed ? "▼" : "▲"}
            </Text>
          </TouchableOpacity>
          {!isCollapsed &&
            placeDetails.opening_hours.weekday_text.map((item) => (
              <View style={{ padding: 10, paddingLeft: 45 }} key={item.id}>
                <Text>{item}</Text>
              </View>
            ))}

          <View
            style={{
              padding: 10,
              borderTopWidth: 0.2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{ height: 30, width: 30 }}
              source={{
                uri: "https://www.pngall.com/wp-content/uploads/10/Message-Background-PNG.png",
              }}
            />
            <Text style={{ paddingLeft: 8, fontWeight: "bold", fontSize: 25 }}>
              Reviews:
            </Text>
          </View>

          <FlatList
            data={placeDetails.reviews}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={{ textAlign: "right" }}>{item.rating}⭐</Text>
                <Image
                  style={{ height: 50, width: 50, borderRadius: 25 }}
                  source={{ uri: item.profile_photo_url }}
                />

                <Text style={{ padding: 10, fontWeight: "bold", fontSize: 25 }}>
                  {item.author_name}
                </Text>

                <Text style={{ fontSize: 10 }}>
                  {item.relative_time_deescriptioin}
                </Text>

                <Text>{item.text}</Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
          />
        </ScrollView>
      </SafeAreaView>
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
    marginLeft: 0,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    width: 353,
  },
  textName: {
    flex: 1,
    fontSize: 17,
    marginLeft: 10,
    fontWeight: "600",
  },
  image: {
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeName: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  googleImageContainer: {
    borderRadius: 10,
  },
  googleImage: {
    width: 353,
    height: 300,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  formattedAddressContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  formattedAddressIcon: {
    height: 30,
    width: 30,
  },
  formattedAddressText: {
    flex: 3,
    paddingLeft: 10,
  },
  ratingText: {
    flex: 2,
    fontSize: 30,
    textAlign: "right",
  },
  businessStatusContainer: {
    borderTopWidth: 0.2,
    padding: 10,
  },
  businessStatusText: {
    paddingLeft: 35,
    fontWeight: "bold",
    fontSize: 25,
  },
});
