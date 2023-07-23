import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import fetchLevels from "../services/fetchLevels";

export default function LevelButtons({
  currentMall,
  currentLevel,
  setCurrentLevel,
}) {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    (async () => {
      const levelsData = await fetchLevels(currentMall);
      setLevels(levelsData);
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
