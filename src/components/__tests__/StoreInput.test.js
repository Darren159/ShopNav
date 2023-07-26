import { render, fireEvent } from "@testing-library/react-native";
import StoreInput from "../StoreInput";

describe("StoreInput", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(
      <StoreInput
        storeName=""
        setStoreName={jest.fn()}
        error={false}
        placeholder="Store Name"
      />
    );
    const inputElement = getByPlaceholderText("Store Name");
    expect(inputElement).toBeTruthy();
  });

  it("calls the setStoreName prop with the input value", () => {
    const setStoreNameMock = jest.fn();
    const { getByPlaceholderText } = render(
      <StoreInput
        storeName=""
        setStoreName={setStoreNameMock}
        error={false}
        placeholder="Store Name"
      />
    );
    const inputElement = getByPlaceholderText("Store Name");

    fireEvent.changeText(inputElement, "Test Store");

    expect(setStoreNameMock).toHaveBeenCalledWith("Test Store");
  });
});
