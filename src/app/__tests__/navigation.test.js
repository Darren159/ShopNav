import { act, fireEvent, waitFor } from "@testing-library/react-native";
// eslint-disable-next-line import/no-unresolved
import { screen, renderRouter } from "expo-router/src/testing-library";
import { router } from "expo-router";
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

jest.mock("../../services/fetchStoreId");

jest.mock("../../services/fetchStoreList");

jest.mock("../../services/fetchNodes.js");

jest.mock("../../services/fetchLevels.js");

jest.mock("../../services/fetchPlaceId");

jest.mock("../../services/fetchPlaceDetails");

jest.mock("../../services/uploadSvg.js");

jest.mock("../../services/uploadStore.js");

fetchLevels.mockResolvedValue([]);

fetchStoreList.mockResolvedValue([]);

fetchMalls.mockResolvedValue([]);

describe("Navigation", () => {
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

  it("can navigate to storeDetails", async () => {
    renderRouter("./src/app");
    act(() => {
      router.push("/storeDetails");
    });
    await waitFor(() => {
      expect(screen).toHavePathname("/storeDetails");
    });
  });

  it("can navigate to developerAccess", async () => {
    renderRouter("./src/app");
    act(() => {
      router.push("/developerAccess");
    });
    await waitFor(() => {
      expect(screen).toHavePathname("/developerAccess");
    });
  });

  it("can push params to storeDetails", async () => {
    renderRouter("./src/app");
    act(() => {
      router.push({
        pathname: "/storeDetails",
        params: {
          locName: "testId",
          promoInfo: "testPromo",
          storeName: "testName",
        },
      });
    });
    await waitFor(() => {
      expect(screen).toHavePathname("/storeDetails");
      expect(screen).toHaveSearchParams({
        locName: "testId",
        promoInfo: "testPromo",
        storeName: "testName",
      });
    });
  });
});
