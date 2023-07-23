import { useEffect } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import PropTypes from "prop-types";

export default function StoreInput({
  storeName,
  setStoreName,
  error,
  placeholder,
}) {
  

  // handle wrong input error
  useEffect(() => {
    
    // only show the Alert once
    if (error) {
      Alert.alert(
        "Invalid Store Input",
        "Try re-typing the store inputs, make sure that there are no symbols used, and double check your spacings",
        [
          {
            text:'OK',
            onPress: () => {
              console.log(" ok, close storeInput error ");
              
            }
          } 
        ]
      );
    }
    
    
  }, [error]);
  
  return (
    <View>
      <TextInput
        onChangeText={setStoreName}
        value={storeName}
        placeholder={placeholder}
        style={{  
          borderColor: error ? "red" : "#000", paddingLeft: 10
        }}
      />
      {error && <Text style={{ color: "red", paddingLeft:10 }}>Invalid store name</Text>}
    </View>
  );
}
StoreInput.propTypes = {
  storeName: PropTypes.string.isRequired,
  setStoreName: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
};
