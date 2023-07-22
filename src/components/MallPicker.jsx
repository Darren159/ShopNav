import { useContext } from "react";
import { View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { MallContext } from "../context/MallProvider";

export default function MallPicker() {
  const { currentMall, setCurrentMall, malls } = useContext(MallContext);

  console.log(currentMall)
  console.log(malls)
  
    return (
      <View >
        <Dropdown
          data={malls}
          labelField="label"
          valueField="value"
          placeholder={currentMall}
          value={currentMall}
          onSelect={(selectedItem) => setCurrentMall(selectedItem.value)}
        />
      </View>
    );
  
}