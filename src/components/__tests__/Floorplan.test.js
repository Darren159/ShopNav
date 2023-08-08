import { Alert } from "react-native";
import { render, waitFor } from "@testing-library/react-native";
import { SvgUri } from "react-native-svg";
import fetchSVGUrl from "../../services/fetchSvgUrl";
import Floorplan from "../Floorplan";
import { MallContext } from "../../app/context/mallProvider";

jest.mock("../../services/fetchMalls");

jest.mock("../../services/fetchStoreList");

jest.mock("../../services/fetchSVGUrl");

jest.mock("react-native-svg");

jest.spyOn(Alert, "alert");

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
const path = [
  { level: 1, coordinates: { x: 0, y: 0 } },
  { level: 1, coordinates: { x: 100, y: 100 } },
];
const svgUrl = "http://example.com/test.svg";

describe("Floorplan", () => {
  it("renders the floorplan with the correct uri", async () => {
    fetchSVGUrl.mockResolvedValue(svgUrl);

    render(
      <MallContext.Provider value={mockedContextValue}>
        <Floorplan currentLevel={currentLevel} path={path} />{" "}
      </MallContext.Provider>
    );

    // Verify that SVG map is displayed with correct URL
    await waitFor(() => {
      const svgUriCalls = SvgUri.mock.calls;
      expect(svgUriCalls).not.toHaveLength(0);
      const latestCallArgs = svgUriCalls[svgUriCalls.length - 1][0];
      expect(latestCallArgs.uri).toBe(svgUrl);
    });
  });

  it("shows an error alert when fetch fails", async () => {
    const error = new Error("fetch error");

    fetchSVGUrl.mockRejectedValue(error);

    const { rerender } = render(
      <MallContext.Provider value={mockedContextValue}>
        <Floorplan currentLevel={currentLevel} path={path} />
      </MallContext.Provider>
    );

    // Ensure alert has been shown
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error in fetching map data",
        "Try reloading the app with better internet connection",
        [{ text: "Reload", onPress: expect.any(Function) }, { text: "OK" }]
      )
    );
    // Get the arguments that were passed to the first call to Alert.alert
    const alertArgs = Alert.alert.mock.calls[0];
    // Find the reload button in the list of buttons
    const reloadButton = alertArgs[2].find(
      (button) => button.text === "Reload"
    );

    // Simulate a successful fetch after reload
    fetchSVGUrl.mockResolvedValue("svgUrl");

    // Call the 'onPress' function for the 'Reload' button
    await waitFor(() => reloadButton.onPress());

    // Check that the component is re-rendered after reload
    rerender(
      <MallContext.Provider value={mockedContextValue}>
        <Floorplan currentLevel={currentLevel} path={path} />{" "}
      </MallContext.Provider>
    );

    expect(fetchSVGUrl).toHaveBeenCalledTimes(2);
  });

  it("shows loading indicator while fetching data", async () => {
    fetchSVGUrl.mockResolvedValue(svgUrl);

    const { getByTestId, queryByTestId } = render(
      <MallContext.Provider value={mockedContextValue}>
        <Floorplan currentLevel={currentLevel} path={path} />{" "}
      </MallContext.Provider>
    );

    // The loading indicator should be in the document
    expect(getByTestId("loading")).toBeTruthy();

    // Expect that the loading indicator eventually is removed
    await waitFor(() => expect(queryByTestId("loading")).toBeNull());
  });
});
