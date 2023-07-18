import { View } from "react-native";
import PropTypes from "prop-types";
import { Picker } from "@react-native-picker/picker";

export default function MallPicker({ currentMall, setCurrentMall, malls }) {
  return (
    <View style={{ height: 50, width: 150 }}>
      <Picker
        selectedValue={currentMall}
        onValueChange={(value) => setCurrentMall(value)}
      >
        {malls.map((mall) => (
          <Picker.Item key={mall} label={mall} value={mall} />
        ))}
      </Picker>
    </View>
  );
}
MallPicker.propTypes = {
  currentMall: PropTypes.string.isRequired,
  setCurrentMall: PropTypes.func.isRequired,
  malls: PropTypes.arrayOf(PropTypes.string).isRequired,
};
