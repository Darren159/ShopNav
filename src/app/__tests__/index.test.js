import renderer from "react-test-renderer";
import { Alert } from "react-native";
import { fireEvent, waitFor, render } from "@testing-library/react-native";
import Directory from "../index";
import { MallContext } from "../context/mallProvider";
import fetchNodeId from "../../services/fetchNodeId";
import fetchNodes from "../../services/fetchNodes";
import fetchLevels from "../../services/fetchLevels";
import fetchStoreList from "../../services/fetchStoreList";
import fetchMalls from "../../services/fetchMalls";

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock("../../../firebaseConfig.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../services/fetchMalls");

jest.mock("../../services/fetchNodeId");

jest.mock("../../services/fetchNodes");

jest.mock("../../services/fetchSVGUrl");

jest.mock("../../services/fetchStoreList");

jest.mock("../../services/fetchNodes.js");

jest.mock("../../services/fetchLevels.js");

const setCurrentMallMock = jest.fn();

const mockedContextValue = {
  currentMall: "Mall 1",
  setCurrentMall: setCurrentMallMock,
  malls: ["Mall 1"],
};

fetchLevels.mockResolvedValue([1]);

fetchStoreList.mockResolvedValue([{ id: "1", name: "Store 1", level: 1 }]);

fetchMalls.mockResolvedValue();

jest.spyOn(Alert, "alert");

describe("Directory", () => {
  it("renders correctly", async () => {
    const tree = renderer
      .create(
        <MallContext.Provider value={mockedContextValue}>
          <Directory />
        </MallContext.Provider>
      )
      .toJSON();
    await waitFor(() => expect(tree).toMatchSnapshot());
  });

  it('renders "Go!" button and shows loading indicator when pressed', async () => {
    fetchNodeId.mockResolvedValue("1");
    fetchNodes.mockResolvedValue({});

    const { getByText, queryByText, getByTestId, queryByTestId } = render(
      <MallContext.Provider value={mockedContextValue}>
        <Directory />
      </MallContext.Provider>
    );

    const goButton = getByText("Go!");
    fireEvent.press(goButton);

    expect(getByTestId("button-loading")).toBeTruthy();
    expect(queryByText("Go!")).toBeNull();

    await waitFor(() => expect(queryByTestId("button-loading")).toBeTruthy());
  });

  it("shows an error alert when calculatePath fails", async () => {
    const error = new Error("An error occurred");

    fetchNodeId.mockRejectedValue(error);
    fetchNodes.mockRejectedValue(error);

    const { getByText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <Directory />
      </MallContext.Provider>
    );

    const goButton = getByText("Go!");
    fireEvent.press(goButton);

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        error.message,
        [{ text: "OK" }],
        { cancelable: false }
      )
    );
  });

  it("shows loading indicator when currentMall is not yet set", async () => {
    const { getByTestId } = render(
      <MallContext.Provider
        value={{ ...mockedContextValue, currentMall: undefined }}
      >
        <Directory />
      </MallContext.Provider>
    );

    expect(getByTestId("map-loading")).toBeTruthy();
  });
});
