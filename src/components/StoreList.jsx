import { Text, View, FlatList, Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function StoreList({ data }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Link
            href={{
              pathname: "/storeDetails",
              params: {
                locName: item.id,
                promoInfo: item.promo ? item.promo : "",
                storeName: item.name,
              },
            }}
          >
            <View style={styles.innerContainer}>
              {item.logo ? (
                <Image
                  source={{
                    uri: item.logo,
                  }}
                  style={styles.image}
                  testID={`logo-${item.id}`}
                />
              ) : (
                <AntDesign
                  name="clockcircleo"
                  size={36}
                  color="black"
                  style={styles.clock}
                  testID={`default-logo-${item.id}`}
                />
              )}
              <Text style={styles.textName}>{item.name}</Text>
            </View>
          </Link>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    borderBottomWidth: 0.2,
    height: 80,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textName: {
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  clock: {
    marginRight: 10,
  },
});
StoreList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
