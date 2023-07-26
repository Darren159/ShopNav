import { render, fireEvent, waitFor } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { MallContext } from "../context/mallProvider";
import DeveloperAccess from "../developerAccess";
import fetchStoreId from "../../services/fetchStoreId";
import uploadStore from "../../services/uploadStore";
import uploadSvg from "../../services/uploadSvg";

jest.mock("expo-document-picker");

jest.mock("../../services/fetchStoreId");

jest.mock("../../services/fetchMalls");

jest.mock("../../services/uploadSvg");

jest.mock("../../services/uploadStore");

const setCurrentMallMock = jest.fn();

const mockedContextValue = {
  currentMall: "Mall 1",
  setCurrentMall: setCurrentMallMock,
  malls: ["Mall 1", "Mall 2", "Mall 3"],
};

jest.spyOn(Alert, "alert");

DocumentPicker.getDocumentAsync.mockResolvedValue({
  type: "success",
  assets: [
    {
      name: "test-file.svg",
      uri: "file:/test-file.svg",
    },
  ],
});

describe("DeveloperAccess", () => {
  it("renders correctly", async () => {
    const tree = renderer
      .create(
        <MallContext.Provider value={mockedContextValue}>
          <DeveloperAccess />
        </MallContext.Provider>
      )
      .toJSON();
    await waitFor(() => expect(tree).toMatchSnapshot());
  });

  it("handles file selection", async () => {
    const { getByText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <DeveloperAccess />
      </MallContext.Provider>
    );

    fireEvent.press(getByText("Select SVG"));
    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();

    await waitFor(() =>
      expect(getByText("Selected file: test-file.svg")).toBeTruthy()
    );
  });

  it("handles file upload", async () => {
    uploadSvg.mockResolvedValue();

    const { getByText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <DeveloperAccess />
      </MallContext.Provider>
    );

    fireEvent.press(getByText("Select SVG"));
    await waitFor(() =>
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled()
    );

    fireEvent.press(getByText("Upload SVG"));

    await waitFor(() =>
      expect(uploadSvg).toHaveBeenCalledWith(
        "Mall 1",
        "file:/test-file.svg",
        "test-file.svg"
      )
    );
  });

  it("handles store information upload", async () => {
    fetchStoreId.mockResolvedValue("store-id");
    uploadStore.mockResolvedValue();

    const { getByText, getByPlaceholderText } = render(
      <MallContext.Provider value={mockedContextValue}>
        <DeveloperAccess />
      </MallContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText("Enter Store"), "Test Store");
    fireEvent.changeText(
      getByPlaceholderText("Input Promo Info"),
      "Promo Info"
    );
    fireEvent.press(getByText("Upload Store Info"));

    expect(fetchStoreId).toHaveBeenCalledWith("Mall 1", "Test Store");

    await waitFor(() =>
      expect(uploadStore).toHaveBeenCalledWith(
        "Mall 1",
        "store-id",
        "Promo Info"
      )
    );
  });
});
