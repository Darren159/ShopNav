/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable indent */
/* eslint-disable import/no-unresolved */
const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { parseStringPromise } = require("xml2js");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

initializeApp();

const db = getFirestore();

exports.uploadSVGData = onCall(async (request) => {
  logger.log(request);
  const svgString = request.data.svg;
  const mallName = request.data.mall;
  logger.log(svgString);
  const svgJSObject = await parseStringPromise(svgString, {
    ignoreAttributes: false,
    attributeNamePrefix: "",
    allowBooleanAttributes: true,
  });

  if (!mallName || mallName.trim() === "") {
    logger.error("mallName is not a non-empty string.");
    return; // Stop processing this request
  }

  const batch = db.batch();

  if (!svgJSObject.svg.g) {
    logger.error("No layers found in the SVG file.");
    return;
  }

  svgJSObject.svg.g.forEach((layer) => {
    if (layer.$["inkscape:label"] === "Nodes") {
      if (!layer.ellipse) {
        logger.error(`No nodes found in the layer ${layer.$.id}.`);
        return; // Skip this layer and move on to the next one
      }
      layer.ellipse.forEach(async (node) => {
        const nodeID = node.$.id;
        if (!nodeID || nodeID.trim() === "") {
          logger.error(`Node ID for node ${nodeID} is not a non-empty string.`);
          return; // Skip this node and move on to the next one
        }
        const x = parseFloat(node.$.cx);
        const y = parseFloat(node.$.cy);
        // Check if the 'desc' tag exists for this node
        if (!node.desc || node.desc.length === 0) {
          logger.error(`Node ${nodeID} does not have a 'desc' tag.`);
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
        const docRef = db
          .collection("review")
          .doc(mallName)
          .collection("nodes")
          .doc(nodeID);
        batch.set(docRef, data);
      });
    } else if (layer.$["inkscape:label"] === "Stores") {
      logger.log("Stores:", JSON.stringify(layer.path, null, 2));
      if (!layer.path) {
        logger.error(`No store paths found in the layer ${layer.$.id}.`);
        return;
      }
      layer.path.forEach(async (path) => {
        const storeID = path.$.id;
        if (!storeID || storeID.trim() === "") {
          logger.error(
            `Store ID for store ${storeID} is not a non-empty string.`
          );
          return; // Skip this store and move on to the next one
        }
        const coordinates = path.$.d;

        // Check if the 'desc' tag exists for this path
        if (!path.desc || path.desc.length === 0) {
          logger.error(`Store path ${storeID} does not have a 'desc' tag.`);
          return; // Skip this store path and move on to the next one
        }
        const desc = path.desc[0]._;
        // Parse the level information from the 'desc' tag
        const level = parseInt(desc.split("=")[1].trim(), 10);

        const data = {
          coordinates,
          level,
        };
        const docRef = db
          .collection("review")
          .doc(mallName) // You need to get the `mallName` from the request data
          .collection("stores")
          .doc(storeID);
        batch.set(docRef, data);
      });
    }
  });
  await batch.commit();
  return { result: "SVG data processed and uploaded successfully" };
});

exports.uploadMallLayout = onCall(async (request) => {
  // Define the upload path
  const mallName = request.data.mall;
  const { filename } = request.data;
  const filePath = `review/${mallName}/${filename}`;
  const svgData = request.data.svg;

  // Convert SVG data from base64 to buffer
  const svgBuffer = Buffer.from(svgData, "base64");

  const bucket = getStorage().bucket("gs://shopnav-33436.appspot.com");

  // Upload the SVG data to Cloud Storage
  const file = bucket.file(filePath);

  await file.save(svgBuffer, {
    metadata: {
      contentType: "image/svg+xml",
    },
  });
});

exports.uploadStoreData = onCall(async (request) => {
  logger.log(request);
  const mallName = request.data.mall;
  const storeDocId = request.data.store;
  const promoInfo = request.data.promo;

  if (!mallName || mallName.trim() === "") {
    logger.error("mallName is not a non-empty string.");
    return; // Stop processing this request
  }
  const data = {
    promoInfo,
  };
  const docRef = db
    .collection("review")
    .doc(mallName)
    .collection("stores")
    .doc(storeDocId);
  await docRef.set(data);
  return { result: "Store data uploaded successfully" };
});
