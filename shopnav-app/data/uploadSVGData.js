// Script to upload SVG data to Firestore
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Assume this is your SVG data in JSON format
let svgData = {
  svgElement1: {
    id: "svgElement1",
    data: {
      type: "store",
      name: "Store Name",
      coordinates: { x: 10, y: 20 },
    }, // Replace with actual SVG data
  },
  svgElement2: {
    id: "svgElement2",
    data: {
      type: "store",
      name: "Store Name",
      coordinates: { x: 10, y: 20 },
    },
  }, // Replace with actual SVG data
};
// More SVG elements...;

//Input name of mall to save data to. This serves as the collection name
const mallName = "Westgate";

async function uploadSVGData() {
  for (let element in svgData) {
    let docRef = db.collection("Westgate").doc(svgData[element].id);
    await docRef.set(svgData[element].data);
    console.log(`Document ${svgData[element].id} uploaded successfully`);
  }
}

uploadSVGData()
  .then(() => console.log("All SVG data uploaded successfully"))
  .catch((error) => console.error("Failed to upload SVG data:", error));
