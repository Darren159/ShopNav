// This is an asynchronous function that fetches the detailed information of a given place (store) using the Google Places API.
// Parameter: 
// placeId - The Google Places ID of the place for which the details need to be fetched.
export default async function fetchPlaceDetails(placeId) {
  
  // Construct the request URL using the place ID and the Google Places API key.
  // Specify the required fields (name, rating, phone number, etc.) in the 'fields' query parameter.
  const url = `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Crating%2Cformatted_phone_number%2Copening_hours%2Creviews%2Cphotos%2Cbusiness_status%2Cformatted_address&place_id=${placeId}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  
  // Fetch the response from the Google Places API.
  const response = await fetch(url);

  // Parse the JSON response.
  const data = await response.json();
  
  // If the response contains any data, return the 'result' object, which contains the place details.
  if (data) {
    return data.result;
  }

   // If there was an error with the API request or if the 'result' object is not present in the response, throw an error.
  throw new Error("Error retrieving place details");
}
