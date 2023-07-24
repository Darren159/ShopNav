export default function handleSearch(fullData, query) {
  const formattedQuery = query.toLowerCase();
  const filteredData = fullData.filter((item) =>
    item.name.toLowerCase().includes(formattedQuery)
  );

  return filteredData;
}
