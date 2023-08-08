export default function handleSearch(fullData, query, category) {
  // filter the data according to whats included in the query
  const filteredData = fullData.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(query.toLowerCase());
    const categoryMatch = !category || item.category.includes(category);
    return nameMatch && categoryMatch;
  });

  return filteredData;
}
