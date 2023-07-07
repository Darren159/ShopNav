import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getNodeIDFromStoreName(currentMall, storeName) {
  const formattedStoreName = storeName.replace(/\s/g, "-").toLowerCase();
  const documentID = `${currentMall.toLowerCase()}-${formattedStoreName}-node`;
  const docRef = doc(db, currentMall, documentID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.id;
  }
  throw new Error();
}

export async function getGraph(currentMall) {
  const mallNodesCollection = collection(db, currentMall);
  const nodesSnapshot = await getDocs(mallNodesCollection);
  const nodeGraph = {};
  nodesSnapshot.docs.forEach((node) => {
    nodeGraph[node.id] = node.data();
  });
  return nodeGraph;
}

export const useMalls = () => {
  const [malls, setMalls] = useState([]);
  const [currentMall, setCurrentMall] = useState(null);

  useEffect(() => {
    const fetchMalls = async () => {
      const mallCollection = collection(db, "malls");
      const mallSnapshot = await getDocs(mallCollection);
      const mallList = mallSnapshot.docs.map((mall) => mall.id);
      setMalls(mallList);
      setCurrentMall(mallList[0]); // Set the first mall as the current mall
    };
    fetchMalls();
  }, []);

  return { malls, currentMall, setCurrentMall };
};
