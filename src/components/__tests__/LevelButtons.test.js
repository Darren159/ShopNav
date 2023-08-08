import { render, waitFor, fireEvent } from "@testing-library/react-native";
import LevelButtons from "../LevelButtons";
import fetchLevels from "../../services/fetchLevels";
import { MallContext } from "../../app/context/mallProvider";

jest.mock("../../services/fetchMalls");

jest.mock("../../services/fetchStoreList");

jest.mock("../../services/fetchLevels");

const setCurrentMallMock = jest.fn();

const mockedContextValue = {
  currentMall: "Mall 1",
  setCurrentMall: setCurrentMallMock,
  malls: ["Mall 1", "Mall 2", "Mall 3"],
  storeList: [
    { id: "1", name: "Store 1" },
    { id: "2", name: "Store 2" },
  ],
};

const currentLevel = 1;
const setCurrentLevelMock = jest.fn();

describe("LevelButtons", () => {
  it("renders levels after fetchLevels is called", async () => {
    fetchLevels.mockResolvedValue([1, 2, 3]);
    const { getByText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <LevelButtons
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevelMock}
        />
      </MallContext.Provider>
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
      <MallContext.Provider value={mockedContextValue}>
        <LevelButtons
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevelMock}
        />
      </MallContext.Provider>
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
      <MallContext.Provider value={mockedContextValue}>
        <LevelButtons
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevelMock}
        />
      </MallContext.Provider>
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
    await waitFor(() => expect(setCurrentLevelMock).toHaveBeenCalledWith(2));
  });
});
