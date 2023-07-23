import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default async function fetchNodes(currentMall) {
  const mallNodesCollection = collection(db, "malls", currentMall, "nodes");
  const nodesSnapshot = await getDocs(mallNodesCollection);
  const nodeGraph = {};
  nodesSnapshot.docs.forEach((node) => {
    nodeGraph[node.id] = node.data();
  });
  return nodeGraph;
}