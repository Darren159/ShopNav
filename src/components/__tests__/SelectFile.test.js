import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import SelectFile from "../SelectFile";

jest.spyOn(Alert, "alert");

describe("SelectButton", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <SelectFile title="Test Button" onPress={jest.fn()} />
    );

    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress prop when pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <SelectFile title="Test Button" onPress={onPressMock} />
    );
    const button = getByText("Test Button");

    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalled();
  });

  it("displays an alert if an error occurs", () => {
    const onPressMock = jest.fn(() => {
      throw new Error("Invalid File");
    });
    const { getByText } = render(
      <SelectFile title="Test Button" onPress={onPressMock} />
    );
    const button = getByText("Test Button");

    fireEvent.press(button);

    expect(Alert.alert).toHaveBeenCalledWith("Error", "Invalid File", [
      {
        text: "Ok",
      },
    ]);
  });
});
