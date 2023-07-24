import { TouchableOpacity, View, Text } from "react-native";
import PropTypes from "prop-types";

export default function UploadButton({ title, onPress }) {

  

  return (
    <View style = {{ width: 300, padding: 10, marginTop: 30, borderColor: 'grey', backgroundColor: '#B6D0D0' , justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={onPress} >
        <Text style = {{ color: "white"}}> {title} </Text>
      </TouchableOpacity>
    </View>
  );
}

UploadButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
