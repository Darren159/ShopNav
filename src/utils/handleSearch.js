export default function handleSearch(fullData, query) {

  // change query to all lowercase
  const formattedQuery = query.toLowerCase();

  // filter the data according to whats included in the query
  const filteredData = fullData.filter((item) =>
    item.name.toLowerCase().includes(formattedQuery)
  );

  return filteredData;
}
