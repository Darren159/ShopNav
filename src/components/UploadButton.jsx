import { useState } from "react";
import { TouchableOpacity, View, Text, ActivityIndicator, Alert } from "react-native";
import PropTypes from "prop-types";

export default function UploadButton({ title, onPress }) {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePress = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onPress();
      
    } catch (err) {
      setError(err.message);
      
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  if (error) {
    Alert.alert(
      `Error in ${title}`,
      `Failed to ${title}`,
      [
        {
          text:'Ok',
          onPress: () => {
          console.log('canceled upload button error message')
          }
        }
      ]
    );
  }
  
  return (
    <View style = {{ width: 300, padding: 10, marginTop: 30, borderColor: 'grey', backgroundColor: '#B6D0D0' , justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={handlePress} >
        <Text style = {{ color: "white"}}> {title} </Text>
      </TouchableOpacity>
    </View>
  );
}

UploadButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
