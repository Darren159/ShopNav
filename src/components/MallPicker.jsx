import { useState, useContext } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { MallContext } from "../app/context/mallProvider";

export default function MallPicker() {
  const [modalVisible, setModalVisible] = useState(false);
  const { currentMall, setCurrentMall, malls } = useContext(MallContext);

  const handleSelect = (value) => {
    setCurrentMall(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <Text>{currentMall || "Select a Mall"}</Text>
        <Entypo name="chevron-thin-down" size={24} color="grey" />
      </TouchableOpacity>
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          {malls.map((mall) => (
            <TouchableOpacity
              key={mall}
              style={styles.textContainer}
              onPress={() => handleSelect(mall)}
            >
              <View style={styles.textContainer}>
                <Text style={styles.button}>{mall}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 150,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ECEEF0",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: { marginLeft: 10 },
  textContainer: {
    height: 40,
    width: 300,
    borderWidth: 0.5,
    justifyContent: "center",
    backgroundColor: "white",
  },
});
