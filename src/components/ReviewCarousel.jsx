import { FlatList, View, Image, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import StarRating from "./StarRating";

// The ReviewCarousel function component renders a carousel of reviews.
export default function ReviewCarousel({ reviews }) {
  return (
    <FlatList
      data={reviews}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer} testId="image-carousel">
          <Image
            style={{ height: 75, width: 75 }}
            source={{ uri: item.profile_photo_url }}
            testID={item.profile_photo_url}
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
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: 300,
    margin: 5,
  },
});

ReviewCarousel.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      author_name: PropTypes.string.isRequired,
      profile_photo_url: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      relative_time_description: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};
