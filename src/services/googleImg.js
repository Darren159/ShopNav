// eslint-disable-next-line import/no-unresolved
import { GOOGLE_PLACES_API_KEY } from "@env";

export default function googleImg(photoReference) {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;

  return url;
}
