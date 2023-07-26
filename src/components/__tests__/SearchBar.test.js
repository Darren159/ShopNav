import { render, fireEvent } from "@testing-library/react-native";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(<SearchBar onSearch={jest.fn()} />);
    const inputElement = getByPlaceholderText("Search...");
    expect(inputElement).toBeTruthy();
  });

  it("calls the onSearch prop with the input value", () => {
    const onSearchMock = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={onSearchMock} />
    );
    const inputElement = getByPlaceholderText("Search...");

    fireEvent.changeText(inputElement, "query");

    expect(onSearchMock).toHaveBeenCalledWith("query");
  });
});
