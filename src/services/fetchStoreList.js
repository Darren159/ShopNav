import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// This asynchronous function fetches a list of stores in the given mall. 
// Parameters: currentMall - The ID or name of the mall for which the store list needs to be fetched
export default async function fetchStoreList(currentMall) {

  // Create a reference to the collection of stores in the specified mall
  const storeCollection = collection(db, "malls", currentMall, "stores");

  // Fetch a snapshot of the store collection
  const storeSnapshot = await getDocs(storeCollection);

  // If the snapshot exists, transform it into a list of store objects, each with an id field and other fields from the document data
  if (storeSnapshot) {
    const storeList = storeSnapshot.docs.map((storeDoc) => ({
      id: storeDoc.id,
      ...storeDoc.data(),
    }));

    // Return the list of stores
    return storeList;
  }

  // If no snapshot was fetched (i.e., no stores found), throw an error
  throw new Error("No stores found");
}
