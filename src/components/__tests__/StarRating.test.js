import { render, waitFor } from "@testing-library/react-native";
import StarRating from "../StarRating";

describe("StarRating", () => {
  it("renders correctly with full rating", async () => {
    const { getAllByTestId, queryAllByTestId } = render(
      <StarRating rating={5} />
    );

    await waitFor(() => {
      expect(getAllByTestId("star-filled").length).toBe(5);
      expect(queryAllByTestId("star-unfilled").length).toBe(0);
    });
  });

  it("renders correctly with partial rating", async () => {
    const { getAllByTestId } = render(<StarRating rating={3} />);

    await waitFor(() => {
      expect(getAllByTestId("star-filled").length).toBe(3);
      expect(getAllByTestId("star-unfilled").length).toBe(2);
    });
  });

  it("renders correctly with zero rating", async () => {
    const { getAllByTestId, queryAllByTestId } = render(
      <StarRating rating={0} />
    );

    await waitFor(() => {
      expect(queryAllByTestId("star-filled").length).toBe(0);
      expect(getAllByTestId("star-unfilled").length).toBe(5);
    });
  });
});
