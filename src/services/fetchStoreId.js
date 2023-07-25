import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default async function fetchStoreId(currentMall, storeName) {
  const formattedStoreName = `${storeName.replace(/\s/g, "-").toLowerCase()}`;

  const documentID1 = `${currentMall.toLowerCase()}-${formattedStoreName}`;
  const documentID2 = `${formattedStoreName}-${currentMall.toLowerCase()}`;

  const docRef1 = doc(db, "malls", currentMall, "stores", documentID1);
  const docSnap1 = await getDoc(docRef1);

  if (docSnap1.exists()) {
    return docSnap1.id;
  }

  const docRef2 = doc(db, "malls", currentMall, "stores", documentID2);
  const docSnap2 = await getDoc(docRef2);

  if (docSnap2.exists()) {
    return docSnap2.id;
  }

  throw new Error("Invalid Store Name");
}
