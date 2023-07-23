/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
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

// Helper function to parse description into an object
function parseDesc(desc) {
  const parts = desc.split("\n").map((part) => {
    const splitParts = part.split("=");
    return { key: splitParts[0].trim(), value: splitParts[1].trim() };
  });

  const parsed = {};
  parts.forEach(({ key, value }) => {
    parsed[key] = value;
  });

  return parsed;
}

async function uploadSVGData(mall, filePath) {
  const svgString = fs.readFileSync(filePath, "utf-8");
  const svgJSObject = await parseString(svgString);

  if (!svgJSObject.svg.g) {
    console.error("No layers found in the SVG file.");
    return;
  }

  svgJSObject.svg.g.forEach((layer) => {
    if (layer.$["inkscape:label"] === "Nodes") {
      if (!layer.ellipse) {
        console.error(`No nodes found in the layer ${layer.$.id}.`);
        return; // Skip this layer and move on to the next one
      }
      layer.ellipse.forEach((node) => {
        const nodeID = node.$.id;
        const x = parseFloat(node.$.cx);
        const y = parseFloat(node.$.cy);
        // Check if the 'desc' tag exists for this node
        if (!node.desc || node.desc.length === 0) {
          console.error(`Node ${nodeID} does not have a 'desc' tag.`);
          return; // Skip this node and move on to the next one
        }
        const desc = parseDesc(node.desc[0]._);

        if (!desc.adjacent || !desc.level) {
          console.error(`Node ${nodeID} has incomplete 'desc' tag.`);
          return; // Skip this node and move on to the next one
        }

        const data = {
          coordinates: { x, y },
          adjacent: desc.adjacent.split(", "),
          level: parseInt(desc.level, 10),
        };

        const docRef = db
          .collection("malls")
          .doc(mall)
          .collection("nodes")
          .doc(nodeID);
        docRef
          .set(data)
          .then(() => console.log(`Document ${nodeID} uploaded successfully`));
      });
    } else if (layer.$["inkscape:label"] === "Stores") {
      if (!layer.path) {
        console.error(`No store paths found in the layer ${layer.$.id}.`);
        return;
      }
      layer.path.forEach((path) => {
        const storeID = path.$.id;
        const coordinates = path.$.d;

        // Check if the 'desc' tag exists for this path
        if (!path.desc || path.desc.length === 0) {
          console.error(`Store path ${storeID} does not have a 'desc' tag.`);
          return; // Skip this store path and move on to the next one
        }
        const desc = parseDesc(path.desc[0]._);

        if (!desc.level || !desc.name) {
          console.error(`Store path ${storeID} has incomplete 'desc' tag.`);
          return; // Skip this store path and move on to the next one
        }

        const data = {
          coordinates,
          level: parseInt(desc.level, 10),
          name: desc.name,
        };

        const docRef = db
          .collection("malls")
          .doc(mall)
          .collection("stores")
          .doc(storeID);
        docRef
          .set(data)
          .then(() => console.log(`Document ${storeID} uploaded successfully`));
      });
    }
  });
}

uploadSVGData(mallName, svgFilePath)
  .then(() => console.log("All SVG data uploaded successfully"))
  .catch((error) => console.error("Failed to upload SVG data:", error));
