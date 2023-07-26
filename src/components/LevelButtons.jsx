import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import fetchLevels from "../services/fetchLevels";

// The LevelButtons function component allows the user to select a level in a mall.
export default function LevelButtons({
  currentMall, // The current mall selected by the user.
  currentLevel, // The current level selected by the user.
  setCurrentLevel, // Function to set the current level.
}) {

  // State to hold the levels in the current mall.
  const [levels, setLevels] = useState([]);

  // Run the effect whenever the current mall or the function to set the current level changes.
  useEffect(() => {
    (async () => {

      // Fetch the levels in the current mall.
      const levelsData = await fetchLevels(currentMall);

      // Set the levels.
      setLevels(levelsData);

      // Set the current level to the first level.
      setCurrentLevel(levelsData[0]);
    })();
  }, [currentMall, setCurrentLevel]);

  return (
    <View style={styles.levelContainer}>
      {levels.map((level) => (
        <TouchableOpacity
          key={level}
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
    flexDirection: "column-reverse",
  },
  levelButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  activeLevelButton: {
    backgroundColor: "#1ECBE1",
  },
  levelText: {
    fontSize: 20,
  },
});

LevelButtons.propTypes = {
  currentMall: PropTypes.string.isRequired,
  currentLevel: PropTypes.number.isRequired,
  setCurrentLevel: PropTypes.func.isRequired,
};
