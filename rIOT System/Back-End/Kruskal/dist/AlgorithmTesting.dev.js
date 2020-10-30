"use strict";

var _require = require("./Geometries.js"),
    Point = _require.Point,
    Edge = _require.Edge,
    DisjointGraphSet = _require.DisjointGraphSet,
    ResetPointIds = _require.ResetPointIds,
    Obstructions = _require.Obstructions,
    Obstruction = _require.Obstruction,
    alterObstructionGraph = _require.alterObstructionGraph,
    setGreatestAttenuation = _require.setGreatestAttenuation;

var _require2 = require("./Algorithm.js"),
    FindExtendedThreeStars = _require2.FindExtendedThreeStars,
    FindBridgingRelays = _require2.FindBridgingRelays,
    FindBridgingRelaysOne = _require2.FindBridgingRelaysOne,
    FindCentroids = _require2.FindCentroids;

var _require3 = require("./Kruskal.js"),
    solve = _require3.solve,
    generateConnectivityPriorityMST = _require3.generateConnectivityPriorityMST,
    generateMinDistancePriorityMST = _require3.generateMinDistancePriorityMST;

var generateRandomNodes = function generateRandomNodes(amount, maxPositionX, maxPositionY) {
  var ID = 1;
  points = [];

  for (var index = 0; index < amount; index++) {
    var randomX = Math.floor(Math.random() * Math.floor(maxPositionX));
    var randomY = Math.floor(Math.random() * Math.floor(maxPositionY));
    var randomR = Math.floor(Math.random() * Math.floor(2 * Math.sqrt(maxPositionX * maxPositionY) / amount) + 2 * Math.sqrt(maxPositionX * maxPositionY) / amount);
    points.push(new Point(randomX, randomY, randomR, 'S', ID));
    ID++;
  }

  return points;
}; // Solve one offers better performance.
// Connectivity MST


var solveOne = function solveOne(points, algorithm) {
  var graph = generateConnectivityPriorityMST(points);
  graph = algorithm(graph);
  return graph.prettyPointsAndEdges();
}; // Min Distance MST


var solveTwo = function solveTwo(points, algorithm) {
  var graph = generateMinDistancePriorityMST(points);
  graph = algorithm(graph);
  return graph.prettyPointsAndEdges();
}; // On average slightly better than the second implementation (by 0.01 - 0.1 of a node).
// As ranges become more varient, this algorithm becomes marginally more efficient (by ~0.2 of a node).


var implementationOne = function implementationOne(graph) {
  FindCentroids(graph);
  graph = generateConnectivityPriorityMST(Array.from(graph.points));
  FindBridgingRelays(graph);
  return graph;
};

var implementationTwo = function implementationTwo(graph) {
  FindCentroids(graph);
  FindBridgingRelays(graph);
  return graph;
}; // Inefficienct as compared to one.


var implementationThree = function implementationThree(graph) {
  FindCentroids(graph);
  graph = generateMinDistancePriorityMST(Array.from(graph.points));
  FindBridgingRelays(graph);
  return graph;
}; // Algorithm four is by far the best under certain conditions. If the max or average range is chosen for the three star, algorithm one will perform better.


var implementationFour = function implementationFour(graph) {
  FindBridgingRelays(graph);
  return graph;
}; // Performs poorly.


var alternativeAlgorithmOne = function alternativeAlgorithmOne(graph) {
  FindBridgingRelaysOne(graph);
  return graph;
}; // Current Winner: Solve One Implementation One


var runIterations = function runIterations(amount, trials, x, y) {
  var firstImplementationRelayCount = 0;
  var secondImplementationRelayCount = 0;
  var thirdImplementationRelayCount = 0;
  var attOne = 0;
  var attTwo = 0;
  var attThree = 0;
  var wallOne = 0;
  var wallTwo = 0;
  var wallThree = 0;

  var _loop = function _loop(index) {
    var nodes = generateRandomNodes(trials, x, y);
    var two = solveOne(nodes, implementationFour);
    var greatestAttenuation = 0;
    two.edges.forEach(function (edge) {
      if (edge.attenuation > greatestAttenuation) {
        greatestAttenuation = edge.attenuation;
      }
    });
    setGreatestAttenuation(greatestAttenuation);
    var one = solveTwo(nodes, alternativeAlgorithmOne);
    setGreatestAttenuation(0);
    firstImplementationRelayCount += one.points.length;
    secondImplementationRelayCount += two.points.length;
    attOne += one.edges.reduce(function (prev, edge) {
      return prev + edge.attenuation;
    }, 0);
    attTwo += two.edges.reduce(function (prev, edge) {
      return prev + edge.attenuation;
    }, 0);
    wallOne += one.edges.reduce(function (prev, edge) {
      return prev + edge.intersections;
    }, 0);
    wallTwo += two.edges.reduce(function (prev, edge) {
      return prev + edge.intersections;
    }, 0);
  };

  for (var index = 0; index < amount; index++) {
    _loop(index);
  }

  firstImplementationRelayCount /= amount;
  secondImplementationRelayCount /= amount;
  attOne /= amount;
  attTwo /= amount;
  wallOne /= amount;
  wallTwo /= amount;
  console.log("For ".concat(amount, " trials:"));
  console.log("First Implementation Average: " + (firstImplementationRelayCount - trials) + " | " + attOne + " | " + wallOne);
  console.log("Second Implementation Average: " + (secondImplementationRelayCount - trials) + " | " + attTwo + " | " + wallTwo);
};

var randomBarriers = function randomBarriers(amount, trials, walls, x, y) {
  var obstacles = Obstructions;
  var maxPositionX = x;
  var maxPositionY = y;
  var testObstructions = [];

  for (var index = 0; index < walls; index++) {
    var randomX1 = Math.floor(Math.random() * Math.floor(maxPositionX));
    var randomY1 = Math.floor(Math.random() * Math.floor(maxPositionY));
    var randomX2 = Math.floor(Math.random() * Math.floor(maxPositionX));
    var randomY2 = Math.floor(Math.random() * Math.floor(maxPositionY));
    var randomObstruction = Math.floor(Math.random() * 4);
    testObstructions.push(new Obstruction(randomX1, randomY1, randomX2, randomY2, randomObstruction === 0 ? "Thin Barrier" : randomObstruction === 1 ? "Thick Barrier" : randomObstruction === 2 ? "Single Wall" : "Brick Barrier"));
  }

  alterObstructionGraph(testObstructions);
  runIterations(amount, trials, x, y);
}; // runIterations(500, 10, 60, 40);


randomBarriers(200, 30, 20, 100, 100);