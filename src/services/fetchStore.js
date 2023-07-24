import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default async function fetchStore(currentMall, storeName) {
  const formattedStoreName = storeName.replace(/\s/g, "-").toLowerCase();
  const documentID = `${currentMall.toLowerCase()}-${formattedStoreName}`;
  const docRef = doc(db, "malls", currentMall, "stores", documentID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.id;
  }
  throw new Error();
}
