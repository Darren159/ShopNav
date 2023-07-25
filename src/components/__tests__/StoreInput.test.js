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
});
