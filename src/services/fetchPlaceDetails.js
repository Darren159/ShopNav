// eslint-disable-next-line import/no-unresolved
import { GOOGLE_PLACES_API_KEY } from "@env";

export default async function fetchPlaceDetails(placeId) {
  // error of Possible Unhandled Promise Rejection (id: 0)
  const url = `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Crating%2Cformatted_phone_number%2Copening_hours%2Creviews%2Cphotos%2Cbusiness_status%2Cformatted_address&place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;
  // console.log("this is the placeId: " + placeId);
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data);

  return data.result;
}
