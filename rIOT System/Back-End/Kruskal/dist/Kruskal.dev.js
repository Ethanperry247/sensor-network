"use strict";

var _this = void 0;

var PriorityQueue = require("./PriorityQueue.js");

var _require = require("./Geometries.js"),
    Point = _require.Point,
    Edge = _require.Edge,
    DisjointGraphSet = _require.DisjointGraphSet,
    ResetPointIds = _require.ResetPointIds,
    Obstructions = _require.Obstructions;

var _require2 = require("./Algorithm.js"),
    FindExtendedThreeStars = _require2.FindExtendedThreeStars,
    FindBridgingRelays = _require2.FindBridgingRelays,
    FindCentroids = _require2.FindCentroids;

var Arrangements = require("./PointArrangements.js");

var fillAllEdges = function fillAllEdges(points) {
  var queue = new PriorityQueue();
  var edgeConnectedQueue = new PriorityQueue();

  for (var firstIndex = 0; firstIndex < points.length; firstIndex++) {
    for (var secondIndex = firstIndex + 1; secondIndex < points.length; secondIndex++) {
      var newEdge = new Edge(points[firstIndex], points[secondIndex]);

      if (newEdge.edgeConnected) {
        edgeConnectedQueue.enqueue(newEdge, newEdge.length);
      } else {
        queue.enqueue(newEdge, newEdge.length);
      }

      edgeConnectedQueue.enqueue(newEdge, newEdge.length);
    }
  }

  edgeConnectedQueue.concatenate(queue);
  return edgeConnectedQueue;
};

var prioritizeConnectivity = function prioritizeConnectivity(points) {
  var queue = new PriorityQueue();
  var edgeConnectedQueue = new PriorityQueue();

  for (var firstIndex = 0; firstIndex < points.length; firstIndex++) {
    for (var secondIndex = firstIndex + 1; secondIndex < points.length; secondIndex++) {
      var newEdge = new Edge(points[firstIndex], points[secondIndex]);

      if (newEdge.edgeConnected) {
        edgeConnectedQueue.enqueue(newEdge, newEdge.strength);
      } else {
        queue.enqueue(newEdge, newEdge.strength);
      }
    }
  }

  edgeConnectedQueue.concatenate(queue);
  return edgeConnectedQueue;
};

var prioritizeMinimumDistance = function prioritizeMinimumDistance(points) {
  var queue = new PriorityQueue();

  for (var firstIndex = 0; firstIndex < points.length; firstIndex++) {
    for (var secondIndex = firstIndex + 1; secondIndex < points.length; secondIndex++) {
      var newEdge = new Edge(points[firstIndex], points[secondIndex]);
      queue.enqueue(newEdge, newEdge.length);
    }
  }

  return queue;
}; // exports.solveTwo = (pointsArray) => {
//     ResetPointIds();
//     pointsArray = Arrangements.StrategicArrangement10;
//     const startTime = process.hrtime.bigint();
//     pointsArray = pointsArray.filter(point => {
//         return point.type !== 'R';
//     });
//     const points = pointsArray.map(point => new Point(point.position[0], point.position[1], point.range, point.type, point.ID));
//     let graph = this.generateConnectivityPriorityMST(points);
//     if (applyAlgorithm) {
//         graph = algorithm ? algorithm(graph) : this.applyAlgorithms(graph);
//     }
//     const totalTime = process.hrtime.bigint() - startTime;
//     return {
//         timeElapsedMs: Number(totalTime) / 1000000,
//         graph: graph.prettyGraph()
//     };
// };


exports.solve = function (pointsArray, applyAlgorithm, algorithm) {
  ResetPointIds();
  pointsArray = Arrangements.StrategicArrangement5;
  var startTime = process.hrtime.bigint();
  pointsArray = pointsArray.filter(function (point) {
    return point.type !== 'R';
  });
  var points = pointsArray.map(function (point) {
    return new Point(point.position[0], point.position[1], point.range, point.type, point.ID);
  });
  var graph;

  if (applyAlgorithm) {
    graph = _this.generateConnectivityPriorityMST(points);
    graph = algorithm ? algorithm(graph) : _this.applyAlgorithms(graph);
  } else {
    graph = _this.generateMinDistancePriorityMST(points);
  } // Obstructions.forEach(item => {
  //     graph.addEdge(new Edge(new Point(item.positions[0][0], item.positions[0][1], 0, 'S', 100), 
  //     new Point(item.positions[1][0], item.positions[1][1]), 0, 'S', 100));
  // });


  var totalTime = process.hrtime.bigint() - startTime;
  return {
    timeElapsedMs: Number(totalTime) / 1000000,
    graph: graph.prettyGraph()
  };
};

exports.generateConnectivityPriorityMST = function (points) {
  var graph = new DisjointGraphSet();
  var queue = prioritizeConnectivity(points); // const queue = prioritizeMinimumDistance(points);

  queue.elements.map(function (element) {
    graph.addEdge(element.data);
  });
  return graph.graphs[0];
};

exports.generateMinDistancePriorityMST = function (points) {
  var graph = new DisjointGraphSet(); // const queue = prioritizeConnectivity(points);

  var queue = prioritizeMinimumDistance(points);
  queue.elements.map(function (element) {
    graph.addEdge(element.data);
  });
  return graph.graphs[0];
};

exports.applyAlgorithms = function (graph) {
  // FindCentroids(graph);
  // graph = this.generateConnectivityPriorityMST(Array.from(graph.points));
  // FindCentroids(graph);
  // FindBridgingRelays(graph);
  // FindExtendedThreeStars(graph);
  // FindExtendedThreeStars(graph);
  // FindExtendedThreeStars(graph);
  // graph = this.generateMST(Array.from(graph.points));
  FindBridgingRelays(graph);
  return graph;
};