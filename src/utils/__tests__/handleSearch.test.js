import handleSearch from "../handleSearch";

const fullData = [
  { name: "Apple" },
  { name: "Banana" },
  { name: "Grape" },
  { name: "Peach" },
  { name: "Blueberry" },
];

describe("handleSearch function", () => {
  it("returns data items where the name includes the query", () => {
    // Run the handleSearch function with a query
    const result = handleSearch(fullData, "ap");

    // Verify the result
    expect(result).toEqual([{ name: "Apple" }, { name: "Grape" }]);
  });

  it("is case-insensitive", () => {
    const result = handleSearch(fullData, "Ap");

    expect(result).toEqual([{ name: "Apple" }, { name: "Grape" }]);
  });

  it("returns an empty array if there is no match", () => {
    const result = handleSearch(fullData, "xyz");

    expect(result).toEqual([]);
  });
});
