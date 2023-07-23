import { useContext } from "react";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { MallContext } from "../app/context/mallProvider";

export default function MallPicker() {
  const { currentMall, setCurrentMall, malls } = useContext(MallContext);
  // Convert array of strings to array of objects
  const data = malls.map((mall) => ({ label: mall, value: mall }));

  return (
    <View>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        placeholder={currentMall}
        value={currentMall}
        onChange={(selectedItem) => setCurrentMall(selectedItem.value)}
      />
    </View>
  );
}
