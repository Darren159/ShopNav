/* eslint-disable indent */
/* eslint-disable import/no-unresolved */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { parseStringPromise } = require("xml2js");

initializeApp();

exports.parseSVGData = onCall(async (request) => {
  const svgString = request.svg;
  const svgJSObject = await parseStringPromise(svgString, {
    ignoreAttributes: false,
    attributeNamePrefix: "",
    allowBooleanAttributes: true,
  });

  logger.log(JSON.stringify(svgJSObject, null, 2));

  logger.log("Layers:", JSON.stringify(svgJSObject.svg.g, null, 2));
  const nodeData = [];
  const storeData = [];

  if (!svgJSObject.svg.g) {
    logger.error("No layers found in the SVG file.");
    return { nodeData, storeData };
  }

  svgJSObject.svg.g.forEach((layer) => {
    logger.log("Layer label:", layer.$["inkscape:label"]);
    logger.log("Layer id:", layer.$.id);
  });

  svgJSObject.svg.g.forEach((layer) => {
    if (layer.$["inkscape:label"] === "Nodes") {
      logger.log("Nodes:", JSON.stringify(layer.ellipse, null, 2));
      if (!layer.ellipse) {
        logger.error(`No nodes found in the layer ${layer.$.id}.`);
        return; // Skip this layer and move on to the next one
      }
      layer.ellipse.forEach((node) => {
        const nodeID = node.$.id;
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
        nodeData.push({
          nodeID,
          coordinates: { x, y },
          adjacent: parts[0][1].split(", "),
          level: parseInt(parts[1][1], 10),
        });
      });
    } else if (layer.$["inkscape:label"] === "Stores") {
      logger.log("Stores:", JSON.stringify(layer.path, null, 2));
      if (!layer.path) {
        logger.error(`No store paths found in the layer ${layer.$.id}.`);
        return;
      }
      layer.path.forEach((path) => {
        const storeID = path.$.id;
        const coordinates = path.$.d;

        // Check if the 'desc' tag exists for this path
        if (!path.desc || path.desc.length === 0) {
          logger.error(`Store path ${storeID} does not have a 'desc' tag.`);
          return; // Skip this store path and move on to the next one
        }
        const desc = path.desc[0]._;
        // Parse the level information from the 'desc' tag
        const level = parseInt(desc.split("=")[1].trim(), 10);

        storeData.push({
          storeID,
          coordinates,
          level,
        });
      });
    }
  });
  return { nodeData, storeData };
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
