import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useContext } from "react";
import { MallContext } from "../app/context/mallProvider";

export default function MallPicker() {
  const { currentMall, setCurrentMall, malls } = useContext(MallContext);

  return (
    <View
      style={{
        height: 50,
        width: 150,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#ECEEF0",
        justifyContent: "center",
      }}
    >
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
