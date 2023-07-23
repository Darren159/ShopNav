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
            <Image
              source={{
                uri: "https://frameandkeyrealestate.files.wordpress.com/2019/04/clock-icon.png",
              }}
              style={styles.image}
            />
            <Text style={styles.textName}>{item.name}</Text>
            {/* {console.log(JSON.stringify(item))} */}
          </Link>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.2,
    height: 100,
  },
  textName: {
    flex: 1,
    fontSize: 17,
    paddingLeft: 10,
    fontWeight: "600",
  },
  image: {
    width: 25,
    height: 25,
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
