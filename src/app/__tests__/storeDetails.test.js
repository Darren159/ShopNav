import { render } from "@testing-library/react-native";
import { Alert } from "react-native";
import { Router } from "expo-router";
import StoreDetails from "../storeDetails";

jest.mock("../../services/fetchPlaceId");
jest.mock("../../services/fetchPlaceDetails");
jest.spyOn(Alert, "alert");

describe("StoreDetails", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <Router
        initialPath="/"
        initialParams={{
          locName: "test",
          promoInfo: "promo",
          storeName: "testStore",
        }}
      >
        <StoreDetails />
      </Router>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
