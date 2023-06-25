import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function LevelButtons({
  currentMall,
  currentLevel,
  setCurrentLevel,
}) {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const fetchLevels = async () => {
      const mallDocRef = doc(db, "malls", currentMall);
      const mallDocSnap = await getDoc(mallDocRef);
      if (mallDocSnap.exists()) {
        const levelsData = Array.from(
          { length: mallDocSnap.data().levels },
          (_, i) => i + 1
        );
        setLevels(levelsData);
        setCurrentLevel(levelsData[0]); // Set the first level as the current level
      }
    };
    fetchLevels();
  }, [currentMall]);
  return (
    <View style={styles.levelContainer}>
      {levels.map((level, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.levelButton,
            currentLevel === level ? styles.activeLevelButton : {},
          ]}
          onPress={() => setCurrentLevel(level)}
        >
          <Text style={styles.levelText}>{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  levelContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  levelButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
  },
  activeLevelButton: {
    backgroundColor: "#1ECBE1",
  },
  levelText: {
    fontSize: 20,
  },
});
