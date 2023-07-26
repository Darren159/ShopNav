import { render } from "@testing-library/react-native";
import ImageCarousel from "../ImageCarousel";
import handleImage from "../../utils/handleImage";

jest.mock("../../utils/handleImage");

const mockPhotos = [
  { photo_reference: "ref1" },
  { photo_reference: "ref2" },
  { photo_reference: "ref3" },
];

describe("<ImageCarousel />", () => {
  handleImage.mockImplementation((ref) => `http://example.com/${ref}`);

  it("renders correctly and calls handleImage for each item", () => {
    const { getByTestId } = render(<ImageCarousel photos={mockPhotos} />);

    mockPhotos.forEach((photo) => {
      expect(handleImage).toHaveBeenCalledWith(photo.photo_reference);
      expect(getByTestId(`image-${photo.photo_reference}`)).toBeTruthy();
    });
  });
});
