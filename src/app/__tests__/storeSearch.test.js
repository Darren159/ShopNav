import { render, fireEvent, waitFor } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { Alert } from "react-native";
import StoreSearch from "../storeSearch";
import { MallContext } from "../context/mallProvider";
import fetchStoreList from "../../services/fetchStoreList";

jest.mock("../../services/fetchStoreList");

jest.mock("../../services/fetchMalls");

const setCurrentMallMock = jest.fn();

const mockedContextValue = {
  currentMall: "Mall 1",
  setCurrentMall: setCurrentMallMock,
  malls: ["Mall 1", "Mall 2", "Mall 3"],
};

const storeList = [
  { id: "1", name: "Store 1" },
  { id: "2", name: "Store 2" },
];

jest.spyOn(Alert, "alert");

describe("StoreSearch", () => {
  it("renders correctly", async () => {
    const tree = renderer
      .create(
        <MallContext.Provider value={mockedContextValue}>
          <StoreSearch />
        </MallContext.Provider>
      )
      .toJSON();
    await waitFor(() => expect(tree).toMatchSnapshot());
  });

  it("renders StoreList with fetched data", async () => {
    fetchStoreList.mockResolvedValue(storeList);
    const { getByText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <StoreSearch />
      </MallContext.Provider>
    );

    await waitFor(() => {
      expect(getByText("Store 1")).toBeTruthy();
      expect(getByText("Store 2")).toBeTruthy();
    });
  });

  it("filters data based on search query", async () => {
    fetchStoreList.mockResolvedValue(storeList);
    const { getByText, getByPlaceholderText, queryByText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <StoreSearch />
      </MallContext.Provider>
    );

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText("Search..."), "Store 2");
      expect(getByText("Store 2")).toBeTruthy();
      expect(queryByText("Store 1")).toBeNull();
    });
  });

  it("shows an error alert when fetchStoreList fails", async () => {
    const error = new Error("An error occurred");

    fetchStoreList.mockRejectedValue(error);

    render(
      <MallContext.Provider value={mockedContextValue}>
        <StoreSearch />
      </MallContext.Provider>
    );

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        error.message,
        [{ text: "OK" }],
        { cancelable: false }
      )
    );
  });

  it("shows loading indicator while fetching data", async () => {
    fetchStoreList.mockResolvedValue(storeList);
    const { getByTestId, queryByTestId } = render(
      <MallContext.Provider value={mockedContextValue}>
        <StoreSearch />
      </MallContext.Provider>
    );
    expect(getByTestId("loading")).toBeTruthy();

    await waitFor(() => expect(queryByTestId("loading")).toBeNull());
  });
});
