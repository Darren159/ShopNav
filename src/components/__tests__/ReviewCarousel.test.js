import { render } from "@testing-library/react-native";
import ReviewCarousel from "../ReviewCarousel";

const mockReviews = [
  {
    author_name: "Test User 1",
    profile_photo_url: "https://example.com/photo1.jpg",
    rating: 5,
    relative_time_description: "A week ago",
    text: "Great place!",
  },
  {
    author_name: "Test User 2",
    profile_photo_url: "https://example.com/photo2.jpg",
    rating: 4,
    relative_time_description: "A month ago",
    text: "Nice experience",
  },
];

describe("ReviewCarousel", () => {
  it("renders reviews correctly", () => {
    const { getByText, getByTestId } = render(
      <ReviewCarousel reviews={mockReviews} />
    );

    mockReviews.forEach((review) => {
      expect(getByText(review.author_name)).toBeTruthy();
      expect(getByTestId(review.profile_photo_url)).toBeTruthy();
      expect(getByText(review.relative_time_description)).toBeTruthy();
      expect(getByText(review.text)).toBeTruthy();
    });
  });
});
