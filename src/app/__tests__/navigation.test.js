import { fireEvent, waitFor } from "@testing-library/react-native";
// eslint-disable-next-line import/no-unresolved
import { screen, renderRouter } from "expo-router/src/testing-library";
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

fetchLevels.mockResolvedValue([]);

fetchStoreList.mockResolvedValue([]);

fetchMalls.mockResolvedValue([]);

describe("Directory", () => {
  it("renders header correctly", async () => {
    renderRouter("./src/app");
    expect(await screen.findByTestId("storeSearch-icon")).toBeTruthy();
    expect(await screen.findByTestId("developerAccess-icon")).toBeTruthy();
    expect(await screen.findByText("Select a Mall")).toBeTruthy();
  });

  it("can navigate to storeSearch", async () => {
    renderRouter("./src/app");
    fireEvent.press(screen.getByTestId("storeSearch-icon"));
    await waitFor(() => {
      expect(screen).toHavePathname("/storeSearch");
    });
  });

  it("can navigate to signIn", async () => {
    renderRouter("./src/app");
    fireEvent.press(screen.getByTestId("developerAccess-icon"));
    await waitFor(() => {
      expect(screen).toHavePathname("/sign-in");
    });
  });
});
