// Script to upload SVG data to Firestore
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const util = require("util");
const parseString = util.promisify(require("xml2js").parseString);

const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const mallName = process.argv[2];
const svgFilePath = process.argv[3];

async function uploadSVGData(mallName, svgFilePath) {
  const svgString = fs.readFileSync(svgFilePath, "utf-8");
  const svgJSObject = await parseString(svgString);

  svgJSObject.svg.g.forEach((layer) => {
    if (layer.$["inkscape:label"] === "Nodes") {
      layer.circle.forEach((node) => {
        const nodeID = node.$.id;
        const x = parseFloat(node.$.cx);
        const y = parseFloat(node.$.cy);
        // Check if the 'desc' tag exists for this node
        if (!node.desc || node.desc.length === 0) {
          console.error(`Node ${nodeID} does not have a 'desc' tag.`);
          return; // Skip this node and move on to the next one
        }
        const desc = node.desc[0]._;
        const parts = desc
          .split("\n")
          .map((part) => part.split("=").map((p) => p.trim()));
        const data = {
          coordinates: { x, y },
          adjacent: parts[0][1].split(", "),
          level: parseInt(parts[1][1], 10),
        };

        const docRef = db.collection(mallName).doc(nodeID);
        docRef
          .set(data)
          .then(() => console.log(`Document ${nodeID} uploaded successfully`));
      });
    }
  });
}

uploadSVGData(mallName, svgFilePath)
  .then(() => console.log("All SVG data uploaded successfully"))
  .catch((error) => console.error("Failed to upload SVG data:", error));
