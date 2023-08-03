import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// This is an asynchronous function that fetches a specific node ID for a given store in a specific mall from Firebase Firestore.
// Parameters:
// currentMall - The name of the mall where the store is located.
// storeName - The name of the store for which the node ID is to be fetched.
export default async function fetchNodeId(currentMall, storeName) {
  // Format the store name to create a node identifier (lowercase, spaces replaced with dashes, appended with '-node').
  const formattedStoreName = `${storeName
    .replace(/[^\w\s]/g, "")
    .replace(/\s/g, "-")
    .toLowerCase()}-node`;

  // Create a document ID by concatenating the lowercase mall ID and the formatted store name.
  const documentID = `${currentMall.toLowerCase()}-${formattedStoreName}`;

  // Get a reference to the specific document (node) in the Firestore collection.
  const docRef = doc(db, "malls", currentMall, "nodes", documentID);

  // Fetch the document.
  const docSnap = await getDoc(docRef);

  // If the document exists, return the document ID. This is the node ID for the specified store.
  if (docSnap.exists()) {
    return docSnap.id;
  }

  // If the document does not exist (i.e., if the store name is invalid), throw an error.
  throw new Error("Invalid Store Name");
}
