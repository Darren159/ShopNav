import { render, fireEvent } from "@testing-library/react-native";
import StoreInput from "../StoreInput";
import { MallContext } from "../../app/context/mallProvider";

jest.mock("../../services/fetchMalls");

jest.mock("../../services/fetchStoreList");

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

describe("StoreInput", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <StoreInput
          storeName=""
          setStoreName={jest.fn()}
          placeholder="Store Name"
          zIndex={1}
        />
      </MallContext.Provider>
    );
    const inputElement = getByPlaceholderText("Store Name");
    expect(inputElement).toBeTruthy();
  });

  it("calls the setStoreName prop with the input value", () => {
    const setStoreNameMock = jest.fn();
    const { getByPlaceholderText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <StoreInput
          storeName=""
          setStoreName={setStoreNameMock}
          placeholder="Store Name"
          zIndex={1}
        />
      </MallContext.Provider>
    );
    const inputElement = getByPlaceholderText("Store Name");

    fireEvent.changeText(inputElement, "Test Store");

    expect(setStoreNameMock).toHaveBeenCalledWith("Test Store");
  });
});
