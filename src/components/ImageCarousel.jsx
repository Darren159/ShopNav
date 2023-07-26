import { FlatList, Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import handleImage from "../utils/handleImage";

// The ImageCarousel function component displays a horizontal carousel of images. Used for Store Details page
export default function ImageCarousel({ photos }) { // The array of photo data objects to display in the carousel.
  return (
    <FlatList
      data={photos}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image
          testID={`image-${item.photo_reference}`}
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
