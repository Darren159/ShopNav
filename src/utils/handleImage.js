export default function handleImage(photoReference) {
  
  // obtain image uri of google Image associated with the unique photo reference
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  return url;
}
