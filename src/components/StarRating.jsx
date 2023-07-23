import { View } from "react-native";
import PropTypes from "prop-types";
import { FontAwesome } from "@expo/vector-icons";

export default function StarRating({ rating }) {
  // Create an array of 5 elements for 5 stars
  const stars = new Array(5).fill(0);

  return (
    <View style={{ flexDirection: "row" }}>
      {stars.map((_, index) => {
        const key = `star-${index}`;
        // If the current index is less than the rating, render a yellow star
        if (index < rating) {
          return (
            <FontAwesome key={key} name="star" size={24} color="#FDCC0D" />
          );
        }
        // Otherwise render a grey star

        return <FontAwesome key={key} name="star" size={24} color="grey" />;
      })}
    </View>
  );
}

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};
