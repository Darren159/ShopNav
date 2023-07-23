import { Button } from "react-native";
import PropTypes from "prop-types";

export default function UploadButton({ title, onPress }) {
  return <Button title={title} onPress={onPress} />;
}

UploadButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
