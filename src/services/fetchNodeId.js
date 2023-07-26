import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default async function fetchNodeId(currentMall, storeName) {
  const formattedStoreName = `${storeName
    .replace(/\s/g, "-")
    .toLowerCase()}-node`;
  const documentID = `${currentMall.toLowerCase()}-${formattedStoreName}`;
  const docRef = doc(db, "malls", currentMall, "nodes", documentID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.id;
  }
  throw new Error("Invalid Store Name");
}
