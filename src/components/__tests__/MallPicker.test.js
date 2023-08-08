import { render, fireEvent } from "@testing-library/react-native";
import MallPicker from "../MallPicker";
import { MallContext } from "../../app/context/mallProvider";

jest.mock("../../services/fetchStoreList");

jest.mock("../../services/fetchMalls");

const setCurrentMallMock = jest.fn();

const mockedContextValue = {
  currentMall: "Mall 1",
  setCurrentMall: setCurrentMallMock,
  malls: ["Mall 1", "Mall 2", "Mall 3"],
};

describe("MallPicker", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <MallPicker />
      </MallContext.Provider>
    );

    expect(getByText("Mall 1")).toBeTruthy();
  });

  it("opens modal and selects new mall on press", () => {
    const { getByText, queryByText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <MallPicker />
      </MallContext.Provider>
    );

    // Open modal
    fireEvent.press(getByText("Mall 1"));
    // Check if modal is open
    expect(getByText("Mall 2")).toBeTruthy();
    // Choose Mall 2
    fireEvent.press(getByText("Mall 2"));
    // Check if modal is closed
    expect(queryByText("Mall 2")).toBeNull();

    expect(setCurrentMallMock).toHaveBeenCalledWith("Mall 2");
  });
});
