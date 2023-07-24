import { Text, View, FlatList, Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Link } from "expo-router";

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
              params: { locName: item.id },
            }}
          >
            <View style={styles.innerContainer}>
              <Image
                source={{
                  uri:
                    item.logo ||
                    "https://frameandkeyrealestate.files.wordpress.com/2019/04/clock-icon.png",
                }}
                style={styles.image}
              />
              <Text style={styles.textName}>{item.name}</Text>
              {/* {console.log(JSON.stringify(item))} */}
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
});
StoreList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
    })
  ).isRequired,
};
