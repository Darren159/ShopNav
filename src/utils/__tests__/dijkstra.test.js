import dijkstra from "../dijkstra";

describe("Dijkstra function", () => {
  it("returns the shortest path between two nodes", () => {
    // Prepare a graph for testing
    const graph = {
      A: {
        coordinates: { x: 0, y: 0 },
        adjacent: ["B", "C"],
      },
      B: {
        coordinates: { x: 1, y: 1 },
        adjacent: ["A", "C", "D"],
      },
      C: {
        coordinates: { x: 2, y: 2 },
        adjacent: ["A", "B", "D"],
      },
      D: {
        coordinates: { x: 3, y: 3 },
        adjacent: ["B", "C"],
      },
    };

    // Run the Dijkstra function
    const result = dijkstra(graph, "A", "D");

    // Verify the result
    expect(result).toEqual([
      {
        coordinates: { x: 0, y: 0 },
        adjacent: ["B", "C"],
      },
      {
        coordinates: { x: 1, y: 1 },
        adjacent: ["A", "C", "D"],
      },
      {
        coordinates: { x: 3, y: 3 },
        adjacent: ["B", "C"],
      },
    ]);
  });

  it("returns null if there is no path", () => {
    const graph = {
      A: {
        coordinates: { x: 0, y: 0 },
        adjacent: [],
      },
      D: {
        coordinates: { x: 3, y: 3 },
        adjacent: [],
      },
    };

    const result = dijkstra(graph, "A", "D");

    expect(result).toBeNull();
  });
});
