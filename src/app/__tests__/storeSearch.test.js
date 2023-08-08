import { render, fireEvent, waitFor } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { Alert } from "react-native";
import StoreSearch from "../storeSearch";
import { MallContext } from "../context/mallProvider";

jest.mock("../../services/fetchStoreList");

jest.mock("../../services/fetchMalls");

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
});
