import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default async function fetchLevels(currentMall) {
  const mallDocRef = doc(db, "malls", currentMall);
  const mallDocSnap = await getDoc(mallDocRef);
  if (mallDocSnap.exists()) {
    const levelsData = Array.from(
      { length: mallDocSnap.data().levels },
      (_, i) => i + 1
    );
    return levelsData;
  }
  throw new Error("Error retrieving level data");
}
