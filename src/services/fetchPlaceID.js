// eslint-disable-next-line import/no-unresolved
import { GOOGLE_PLACES_API_KEY } from "@env";

export default async function fetchPlaceID(storeName) {
  // encode the location string to be URL-friendly
  const encodedLocation = encodeURIComponent(`${storeName} Singapore `);

  const requestUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedLocation}&key=${GOOGLE_PLACES_API_KEY}`;

  const response = await fetch(requestUrl);

  // parse the JSON response
  const data = await response.json();
  // console.log(data);

  // the data object now contains the details about the location
  // for example, you might display the first prediction's description -- it is working and alert is showing, but how do i make it into a new page with all the details
  if (data.predictions && data.predictions.length > 0) {
    // console.log(`Top result: ${data.predictions[0].description}`);
    // console.log(`place id: ${data.predictions[0].place_id}`);
    return data.predictions[0].place_id;
  }
  return null;
}
