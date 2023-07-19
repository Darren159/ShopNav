import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getNodeIDFromStoreName(currentMall, storeName) {
  const formattedStoreName = storeName.replace(/\s/g, "-").toLowerCase();
  const documentID = `${currentMall.toLowerCase()}-${formattedStoreName}-node`;
  const docRef = doc(db, "malls", currentMall, "nodes", documentID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.id;
  }
  throw new Error();
}

export async function getStore(currentMall, storeName) {
  const formattedStoreName = storeName.replace(/\s/g, "-").toLowerCase();
  const documentID = `${currentMall.toLowerCase()}-${formattedStoreName}`;
  const docRef = doc(db, "malls", currentMall, "stores", documentID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.id;
  }
  throw new Error();
}

export async function getGraph(currentMall) {
  const mallNodesCollection = collection(db, "malls", currentMall, "nodes");
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

export const useStores = (currentMall) => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const storeCollection = collection(db, "malls", currentMall, "stores");
      const storeSnapshot = await getDocs(storeCollection);
      const storeList = storeSnapshot.docs.map((storeDoc) => ({
        id: storeDoc.id,
        ...storeDoc.data(),
      }));
      setStores(storeList);
    };
    if (currentMall) {
      fetchStores();
    }
  }, [currentMall]);
  return { stores };
};

export async function getLevelsData(currentMall) {
  if (currentMall) {
    // Check if currentMall is set
    const mallDocRef = doc(db, "malls", currentMall);
    const mallDocSnap = await getDoc(mallDocRef);
    if (mallDocSnap.exists()) {
      const levelsData = Array.from(
        { length: mallDocSnap.data().levels },
        (_, i) => i + 1
      );
      return levelsData;
    }
  }
  return [];
}

export async function uploadSVGData(currentMall, nodeData, storeData) {
  const nodeRef = collection(db, "review", currentMall, "nodes");
  const nodePromises = nodeData.map((node) =>
    setDoc(doc(nodeRef, node.nodeID), {
      coordinates: node.coordinates,
      adjacent: node.adjacent,
      level: node.level,
    })
  );

  const storeRef = collection(db, "review", currentMall, "stores");
  const storePromises = storeData.map((store) =>
    setDoc(doc(storeRef, store.storeID), {
      coordinates: store.coordinates,
      level: store.level,
    })
  );

  // Wait for all uploads to finish
  await Promise.all([...nodePromises, ...storePromises]);
}
