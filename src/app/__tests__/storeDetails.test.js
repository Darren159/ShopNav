import { render, waitFor, fireEvent } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { Alert } from "react-native";
import StoreDetails from "../storeDetails";
import fetchPlaceDetails from "../../services/fetchPlaceDetails";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    locName: "Test Location",
    promoInfo: "testPromo",
    storeName: "testStore",
  }),
}));

jest.mock("../../services/fetchPlaceId");

jest.mock("../../services/fetchPlaceDetails");

jest.spyOn(Alert, "alert");

const details = {
  formatted_address: "123 Test Street",
  rating: 4.5,
  business_status: "OPERATIONAL",
  formatted_phone_number: "123-456-7890",
  opening_hours: {
    open_now: true,
    weekday_text: ["Monday: 9:00 AM - 5:00 PM", "Tuesday: 9:00 AM - 5:00 PM"],
  },
};

describe("StoreDetails", () => {
  it("renders correctly", async () => {
    const tree = renderer.create(<StoreDetails />).toJSON();
    await waitFor(() => expect(tree).toMatchSnapshot());
  });
  it("shows store details when data is fetched", async () => {
    fetchPlaceDetails.mockResolvedValue(details);

    const { getByText } = render(<StoreDetails />);

    await waitFor(() => {
      expect(getByText("testStore")).toBeTruthy();
      expect(getByText("123 Test Street")).toBeTruthy();
      expect(getByText("4.5")).toBeTruthy();
      expect(getByText("Operational")).toBeTruthy();
      expect(getByText("123-456-7890")).toBeTruthy();
      expect(getByText("Open")).toBeTruthy();
      expect(getByText("testPromo")).toBeTruthy();
    });
  });

  it("shows and hides operating hours when toggle is pressed", async () => {
    fetchPlaceDetails.mockResolvedValue(details);

    const { getByText, queryByText } = render(<StoreDetails />);

    await waitFor(() => {
      expect(queryByText("Monday: 9:00 AM - 5:00 PM")).toBeNull();
      expect(queryByText("Tuesday: 9:00 AM - 5:00 PM")).toBeNull();
    });

    fireEvent.press(getByText("Operating Hours:"));

    await waitFor(() => {
      expect(getByText("Monday: 9:00 AM - 5:00 PM")).toBeTruthy();
      expect(getByText("Tuesday: 9:00 AM - 5:00 PM")).toBeTruthy();
    });

    fireEvent.press(getByText("Operating Hours:"));

    await waitFor(() => {
      expect(queryByText("Monday: 9:00 AM - 5:00 PM")).toBeNull();
      expect(queryByText("Tuesday: 9:00 AM - 5:00 PM")).toBeNull();
    });
  });

  it("shows an error alert when fetch fails", async () => {
    const error = new Error("An error occurred");

    fetchPlaceDetails.mockRejectedValue(error);

    render(<StoreDetails />);

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "An error occurred",
        [{ text: "OK" }],
        { cancelable: false }
      )
    );
  });

  it("shows loading indicator while fetching data", async () => {
    fetchPlaceDetails.mockResolvedValue(details);
    const { getByTestId, queryByTestId } = render(<StoreDetails />);

    expect(getByTestId("loading")).toBeTruthy();

    await waitFor(() => expect(queryByTestId("loading")).toBeNull());
  });
});
