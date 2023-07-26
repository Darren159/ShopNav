/* eslint-disable no-restricted-syntax */
// The dijkstra function finds the shortest path between two nodes
export default function dijkstra(graph, startNode, endNode) {
  let unvisitedNodes = Object.keys(graph);
  const distances = {};
  const previousNodes = {};
  const visitedNodes = {};

  for (const node of unvisitedNodes) {
    distances[node] = Infinity;
    previousNodes[node] = null;
  }
  distances[startNode] = 0;

  while (unvisitedNodes.length > 0) {
    let currentNode = unvisitedNodes.reduce((closestNode, node) => {
      if (distances[node] < distances[closestNode]) {
        return node;
      }
      return closestNode;
    });
    if (currentNode === endNode && previousNodes[currentNode] !== null) {
      const path = [];
      while (previousNodes[currentNode] !== null) {
        path.unshift(graph[currentNode]);
        currentNode = previousNodes[currentNode];
      }
      path.unshift(graph[currentNode]);
      return path;
    }
    visitedNodes[currentNode] = true;
    unvisitedNodes = unvisitedNodes.filter((node) => node !== currentNode);

    for (const adjacentNode of graph[currentNode].adjacent) {
      if (!visitedNodes[adjacentNode]) {
        const newDistance =
          distances[currentNode] +
          distance(
            graph[currentNode].coordinates,
            graph[adjacentNode].coordinates
          );
        if (newDistance < distances[adjacentNode]) {
          distances[adjacentNode] = newDistance;
          previousNodes[adjacentNode] = currentNode;
        }
      }
    }
  }
  return null; // No path found
}

// The distance function calculates the Euclidean distance between two points
function distance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
