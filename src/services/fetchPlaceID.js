// This is an asynchronous function that fetches the Google Places ID for a given store in Singapore using the Google Places API.
// Parameter: 
// storeName - The name of the store for which the Places ID needs to be fetched.
export default async function fetchPlaceId(storeName) {
  // URL-encode the store name to make it URL-friendly, appending 'Singapore' to ensure the search is locale-specific.
  const encodedLocation = encodeURIComponent(`${storeName} Singapore `);

   // Construct the request URL using the encoded store name and the Google Places API key.
  const requestUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedLocation}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

   // Fetch the response from the Google Places API.
  const response = await fetch(requestUrl);

  // parse the JSON response
  const data = await response.json();

  // If the response contains predictions and there's at least one prediction,
  if (data.predictions && data.predictions.length > 0) {
    return data.predictions[0].place_id;
  }

  // If no predictions were found or if there was an error with the API request, throw an error.
  throw new Error("Error retrieving place id");
}
