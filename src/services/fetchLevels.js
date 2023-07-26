import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// This is an asynchronous function that fetches the list of all levels in a mall from Firebase Firestore.
export default async function fetchLevels(currentMall) {

  // Get a reference to the document of the specified mall in the 'malls' collection.
  const mallDocRef = doc(db, "malls", currentMall);

  // Fetch the mall document from the Firestore.
  const mallDocSnap = await getDoc(mallDocRef);

  // If the document snapshot exists (i.e., if data was successfully fetched), create an array (levelsData) of all level numbers in the mall.
  if (mallDocSnap.exists()) {
    const levelsData = Array.from(

      // The array's length is equal to the number of levels in the mall, as specified in the mall document.
      { length: mallDocSnap.data().levels },
      (_, i) => i + 1
    );

    // Return the array of level numbers.
    return levelsData;
  }
  
  // If the document snapshot does not exist (i.e., if data could not be fetched), throw an error.
  throw new Error("Error retrieving level data");
}
