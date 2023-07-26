import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// This asynchronous function fetches the ID of a store in a given mall based on its name. 
// Parameters: 
// currentMall - The ID or name of the mall where the store is located
// storeName - The name of the store whose ID needs to be fetched
export default async function fetchStoreId(currentMall, storeName) {

  // Format the store name by replacing spaces with hyphens and converting to lowercase
  const formattedStoreName = `${storeName.replace(/\s/g, "-").toLowerCase()}`;

  // Construct two potential document IDs (the combination of mall and store names can be in two orders)
  const documentID1 = `${currentMall.toLowerCase()}-${formattedStoreName}`;
  const documentID2 = `${formattedStoreName}-${currentMall.toLowerCase()}`;

  // Create a reference to the first potential document
  const docRef1 = doc(db, "malls", currentMall, "stores", documentID1);
  const docSnap1 = await getDoc(docRef1);

  // If the first document exists, return its ID
  if (docSnap1.exists()) {
    return docSnap1.id;
  }

  // Create a reference to the second potential document
  const docRef2 = doc(db, "malls", currentMall, "stores", documentID2);
  const docSnap2 = await getDoc(docRef2);

  // If the second document exists, return its ID
  if (docSnap2.exists()) {
    return docSnap2.id;
  }

   // If neither document exists (i.e., the store name is invalid), throw an error
  throw new Error("Invalid Store Name");
}
