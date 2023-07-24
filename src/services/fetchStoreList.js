import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default async function fetchStoreList(currentMall) {
  const storeCollection = collection(db, "malls", currentMall, "stores");
  const storeSnapshot = await getDocs(storeCollection);
  if (storeSnapshot) {
    const storeList = storeSnapshot.docs.map((storeDoc) => ({
      id: storeDoc.id,
      ...storeDoc.data(),
    }));

    return storeList;
  }
  throw new Error("No stores found");
}
