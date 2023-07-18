/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function moveDocuments() {
  const sourceCollection = db.collection("Westgate");
  const destinationCollection = db
    .collection("malls")
    .doc("Westgate")
    .collection("nodes");

  const snapshot = await sourceCollection.get();
  const batch = db.batch();

  snapshot.forEach((doc) => {
    // Generate a reference to a new document in the destination collection with the same ID
    const newDocRef = destinationCollection.doc(doc.id);

    // Queue up a batched write to the new document with the data from the existing document
    batch.set(newDocRef, doc.data());

    // Queue up a batched delete for the existing document
    // batch.delete(doc.ref);
  });

  // Commit the batch
  await batch.commit();
  console.log(
    "Moved all documents from sourceCollection to destinationCollection."
  );
}

moveDocuments().catch(console.error);
