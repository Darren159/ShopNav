import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getNodeIDFromStoreName(currentMall, storeName) {
  const formattedStoreName = storeName.replace(/\s/g, "-").toLowerCase();
  const documentID = `${currentMall.toLowerCase()}-${formattedStoreName}-node`;
  const docRef = doc(db, currentMall, documentID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.id;
  } else {
    throw new Error(`${storeName} does not exist`);
  }
}

export async function getGraph(currentMall) {
  const mallNodesCollection = collection(db, currentMall);
  const nodesSnapshot = await getDocs(mallNodesCollection);
  let nodes = {};
  nodesSnapshot.docs.forEach((doc) => {
    nodes[doc.id] = doc.data();
  });
  return nodes;
}
