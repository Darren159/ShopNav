import { render, waitFor } from "@testing-library/react-native";
import { SvgUri } from "react-native-svg";
import fetchSVGUrl from "../../services/fetchSVGUrl";
import Floorplan from "../Floorplan";

jest.mock("../../services/fetchSVGUrl", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-native-svg");

describe("Floorplan", () => {
  const currentMall = "testMall";
  const currentLevel = 1;

  it("displays SVG for the current mall and level", async () => {
    const svgUrl = "http://example.com/test.svg";
    fetchSVGUrl.mockResolvedValue(svgUrl);

    render(<Floorplan currentMall={currentMall} currentLevel={currentLevel} />);

    // Expect the SVG to be fetched
    expect(fetchSVGUrl).toHaveBeenCalledWith(currentMall, currentLevel);

    // Expect SvgUri component to be called with the fetched URL
    await waitFor(() => {
      const svgUriCalls = SvgUri.mock.calls;
      expect(svgUriCalls).not.toHaveLength(0);
      const latestCallArgs = svgUriCalls[svgUriCalls.length - 1][0];
      expect(latestCallArgs.uri).toBe(svgUrl);
      expect(latestCallArgs).toHaveProperty("testID", "svg-image");
      expect(latestCallArgs).toHaveProperty("height");
      expect(latestCallArgs).toHaveProperty("width");
    });
  });
});
