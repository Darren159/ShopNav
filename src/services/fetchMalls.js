// fetchMalls.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default async function fetchMalls() {
  const mallCollection = collection(db, "malls");
  const mallSnapshot = await getDocs(mallCollection);
  if (mallSnapshot) {
    const mallList = mallSnapshot.docs.map((mall) => mall.id);
    return mallList;
  }
  throw new Error("Error retrieving mall data");
}
