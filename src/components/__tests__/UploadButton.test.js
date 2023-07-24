import { render, fireEvent } from "@testing-library/react-native";

import UploadButton from "../UploadButton";

describe("<UploadButton />", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <UploadButton title="Test Button" onPress={() => {}} />
    );
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress function when pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <UploadButton title="Test Button" onPress={onPressMock} />
    );

    fireEvent.press(getByText("Test Button"));
    expect(onPressMock).toHaveBeenCalled();
  });
});
