import { FlatList, Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import handleImage from "../utils/handleImage";

export default function ImageCarousel({ photos }) {
  return (
    <FlatList
      data={photos}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image
          source={{ uri: handleImage(item.photo_reference) }}
          style={styles.image}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={styles.image.width + 2 * styles.image.margin}
      snapToAlignment="center"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    margin: 5,
  },
});

ImageCarousel.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      photo_reference: PropTypes.string.isRequired,
    })
  ).isRequired,
};
