import { render, waitFor, fireEvent } from "@testing-library/react-native";
import LevelButtons from "../LevelButtons";
import fetchLevels from "../../services/fetchLevels";

jest.mock("../../services/fetchLevels", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const setCurrentLevelMock = jest.fn();
const currentMall = "testMall";
const currentLevel = 1;

describe("LevelButtons", () => {
  it("renders levels after fetchLevels is called", async () => {
    fetchLevels.mockResolvedValue([1, 2, 3]);
    const { getByText } = render(
      <LevelButtons
        currentMall={currentMall}
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevelMock}
      />
    );

    await waitFor(() => {
      expect(getByText("1")).toBeTruthy();
      expect(getByText("2")).toBeTruthy();
      expect(getByText("3")).toBeTruthy();
    });
  });

  it("does nothing when there are no levels", async () => {
    fetchLevels.mockResolvedValue([]);

    const { queryByText } = render(
      <LevelButtons
        currentMall={currentMall}
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevelMock}
      />
    );

    await waitFor(() => {
      expect(queryByText("1")).toBeNull();
      expect(queryByText("2")).toBeNull();
      expect(queryByText("3")).toBeNull();
    });
  });
  it("changes the current level when a level button is pressed", async () => {
    fetchLevels.mockResolvedValue([1, 2, 3]);
    const { getByText } = render(
      <LevelButtons
        currentMall={currentMall}
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevelMock}
      />
    );

    // Wait for the levels to be loaded and the buttons to be rendered
    await waitFor(() => {
      expect(getByText("1")).toBeTruthy();
      expect(getByText("2")).toBeTruthy();
      expect(getByText("3")).toBeTruthy();
    });

    // Simulate pressing the "2" button
    fireEvent.press(getByText("2"));

    // Check that setCurrentLevel was called with the correct level
    await waitFor(() => {
      expect(setCurrentLevelMock).toHaveBeenCalledWith(2);
    });
  });
});
