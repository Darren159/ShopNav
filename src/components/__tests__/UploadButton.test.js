import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import UploadButton from "../UploadButton";

jest.spyOn(Alert, "alert");

describe("<UploadButton />", () => {
  it("renders correctly", async () => {
    const { getByText } = render(
      <UploadButton title="Test Button" onPress={() => {}} />
    );

    await waitFor(() => {
      expect(getByText("Test Button")).toBeTruthy();
    });
  });

  it("calls onPress function when pressed", async () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <UploadButton title="Test Button" onPress={onPressMock} />
    );

    fireEvent.press(getByText("Test Button"));

    await waitFor(() => {
      expect(onPressMock).toHaveBeenCalled();
    });
  });

  it("shows error alert on failed press", async () => {
    const onPressMock = jest.fn(() => {
      throw new Error("Test error");
    });
    const { getByText } = render(
      <UploadButton title="Test Button" onPress={onPressMock} />
    );

    fireEvent.press(getByText("Test Button"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error in Test Button",
        "Test error",
        [
          {
            text: "Ok",
          },
        ]
      );
    });
  });

  it("shows loading indicator on press", async () => {
    const onPressMock = jest.fn();

    const { getByText, getByTestId, queryByTestId } = render(
      <UploadButton title="Test Button" onPress={onPressMock} />
    );

    fireEvent.press(getByText("Test Button"));

    expect(getByTestId("loading")).toBeTruthy();

    // Expect that the loading indicator eventually is removed
    await waitFor(() => expect(queryByTestId("loading")).toBeNull());
  });
});
