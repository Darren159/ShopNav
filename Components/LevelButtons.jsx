import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { getLevelsData } from "../services/databaseService";

export default function LevelButtons({
  currentMall,
  currentLevel,
  setCurrentLevel,
}) {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const fetchLevels = async () => {
      // Check if currentMall is set
      const levelsData = await getLevelsData(currentMall);
      setLevels(levelsData);
      setCurrentLevel(levelsData[0]); // Set the first level as the current level
    };
    fetchLevels();
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

LevelButtons.propTypes = {
  currentMall: PropTypes.string.isRequired,
  currentLevel: PropTypes.number.isRequired,
  setCurrentLevel: PropTypes.func.isRequired,
};
