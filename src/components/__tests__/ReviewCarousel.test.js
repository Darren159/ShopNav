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
    const { getAllByText } = render(<ReviewCarousel reviews={mockReviews} />);

    mockReviews.forEach((review) => {
      const authorElement = getAllByText(review.author_name);
      const relativeTimeElement = getAllByText(
        review.relative_time_description
      );
      const reviewTextElement = getAllByText(review.text);

      expect(authorElement).toHaveLength(1);
      expect(relativeTimeElement).toHaveLength(1);
      expect(reviewTextElement).toHaveLength(1);
    });
  });
});
