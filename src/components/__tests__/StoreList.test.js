import { render } from "@testing-library/react-native";
import StoreList from "../StoreList";

const data = [
  { id: "1", name: "Store 1", level: 1, logo: "logo1.png" },
  { id: "2", name: "Store 2", level: 2 },
  { id: "3", name: "Store 3", level: 3, logo: "logo3.png" },
];
describe("StoreList", () => {
  it("renders store names correctly", () => {
    const { getByText } = render(<StoreList data={data} />);

    data.forEach((store) => {
      const item = getByText(store.name);
      expect(item).toBeTruthy();
    });
  });

  it("renders custom logo when provided", () => {
    const storesWithLogo = data.filter((store) => store.logo);
    const { getByTestId } = render(<StoreList data={storesWithLogo} />);

    storesWithLogo.forEach((store) => {
      const logo = getByTestId(`logo-${store.id}`);
      expect(logo).toBeTruthy();
    });
  });

  it("renders default logo when not provided", () => {
    const storesWithoutLogo = data.filter((store) => !store.logo);
    const { getByTestId } = render(<StoreList data={storesWithoutLogo} />);

    storesWithoutLogo.forEach((store) => {
      const defaultLogo = getByTestId(`default-logo-${store.id}`);
      expect(defaultLogo).toBeTruthy();
    });
  });
});
