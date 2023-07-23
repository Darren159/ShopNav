import { render, fireEvent } from "@testing-library/react-native";
import StoreInput from "../StoreInput";

describe("StoreInput", () => {
  it("displays the store name and updates it on change", () => {
    const setStoreName = jest.fn();
    const { getByPlaceholderText } = render(
      <StoreInput
        storeName=""
        setStoreName={setStoreName}
        error={false}
        placeholder="Store Name"
      />
    );
    const input = getByPlaceholderText("Store Name");
    fireEvent.changeText(input, "Test Store");
    expect(setStoreName).toHaveBeenCalledWith("Test Store");
  });

  it("displays an error when error prop is true", () => {
    const setStoreName = jest.fn();
    const { getByText } = render(
      <StoreInput
        storeName="Test Store"
        setStoreName={setStoreName}
        error
        placeholder="Store Name"
      />
    );
    expect(getByText("Invalid store name")).toBeTruthy();
  });
});
