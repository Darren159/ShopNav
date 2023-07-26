// fetchMalls.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// This is an asynchronous function that fetches the list of all malls from Firebase Firestore.
export default async function fetchMalls() {

  // Get a reference to the 'malls' collection in the Firestore database.
  const mallCollection = collection(db, "malls");

  // Fetch all documents (malls) from the 'malls' collection.
  const mallSnapshot = await getDocs(mallCollection);

  // If the snapshot exists (i.e., if data was successfully fetched), create an array (mallList) of all mall IDs.
  if (mallSnapshot) {
    const mallList = mallSnapshot.docs.map((mall) => mall.id);
    return mallList;
  }

  // If the snapshot does not exist (i.e., if data could not be fetched), throw an error.
  throw new Error("Error retrieving mall data");
}
