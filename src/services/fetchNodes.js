import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// This is an asynchronous function that fetches node data for a specific mall from Firebase Firestore.
// Parameter: 
// currentMall - The name of the mall for which the nodes need to be fetched.
export default async function fetchNodes(currentMall) {

  // Get a reference to the collection of nodes for the current mall in Firestore.
  const mallNodesCollection = collection(db, "malls", currentMall, "nodes");

  // Fetch the documents (nodes) from the collection.
  const nodesSnapshot = await getDocs(mallNodesCollection);

  // If the snapshot exists (i.e., if there are documents in the collection), 
  // create a new object 'nodeGraph' and populate it with the nodes' data (using the document ID as the key).
  if (nodesSnapshot) {
    const nodeGraph = {};
    nodesSnapshot.docs.forEach((node) => {
      nodeGraph[node.id] = node.data();
    });

    // Return the node graph.
    return nodeGraph;
  }

  // If the snapshot does not exist (i.e., if there are no documents in the collection), throw an error.
  throw new Error("Error calcualting path");
}
