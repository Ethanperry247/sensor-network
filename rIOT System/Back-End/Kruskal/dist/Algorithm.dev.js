"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("./Geometries.js"),
    Graph = _require.Graph,
    Point = _require.Point,
    Edge = _require.Edge; // Get the distance between two points.


var getDistance = function getDistance(point1, point2) {
  return Math.sqrt(Math.pow(point1.position[0] - point2.position[0], 2) + Math.pow(point1.position[1] - point2.position[1], 2));
}; // Check if the range of two points intersect.


var checkIntersection = function checkIntersection(point1, point2) {
  var distance = getDistance(point1, point2);
  return distance < point1.getRange(point2) + point2.getRange(point1);
}; // Check if a point is inside of the range of another point.


var checkWithinRange = function checkWithinRange(point1, point2) {
  var distance = getDistance(point1, point2);
  return distance < point1.getRange(point2);
}; // Find the points which bridge the distance between two points which are out of range.


var bridgeRelays = function bridgeRelays(point1, point2) {
  var x = point2.position[0] - point1.position[0];
  var y = point2.position[1] - point1.position[1];
  var distance = getDistance(point1, point2);
  var normalVector = [x / distance, y / distance];
  var minRange = point1.getRange(point2) < point2.getRange(point1) ? point1.getRange(point2) : point2.getRange(point1);
  var numRelays = Math.ceil(distance / minRange);
  return [point1].concat(_toConsumableArray(_toConsumableArray(Array(numRelays - 1).keys()).map(function (relay, index) {
    var point = new Point(point1.position[0] + normalVector[0] * (index + 1) * distance / numRelays, point1.position[1] + normalVector[1] * (index + 1) * distance / numRelays, minRange, 'R');
    return point;
  })), [point2]);
};

var bridgeRelaysTwo = function bridgeRelaysTwo(point1, point2) {
  var x = point2.position[0] - point1.position[0];
  var y = point2.position[1] - point1.position[1];
  var distance = getDistance(point1, point2);
  var normalVector = [x / distance, y / distance];
  var minRange = point1.getRange(point2) < point2.getRange(point1) ? point1.getRange(point2) : point2.getRange(point1);
  var numRelays = Math.ceil(distance / minRange);
  var relays = [point1].concat(_toConsumableArray(_toConsumableArray(Array(numRelays - 1).keys()).map(function (relay, index) {
    var point = new Point(point1.position[0] + normalVector[0] * (index + 1) * distance / numRelays, point1.position[1] + normalVector[1] * (index + 1) * distance / numRelays, minRange, 'R');
    return point;
  })), [point2]);
  var previous = relays[0];

  for (var index = 1; index < relays.length - 1; index++) {
    var edge = new Edge(previous, relays[index + 1]);

    if (edge.edgeConnected) {
      relays.splice(index, 1);
      index--;
    } else {
      previous = relays[index];
    }
  }

  return relays;
}; // Find the two intersections of two points.


var findIntersections = function findIntersections(point1, point2) {
  var x1 = point1.position[0];
  var y1 = point1.position[1];
  var r1 = point1.getRange(point2);
  var x2 = point2.position[0];
  var y2 = point2.position[1];
  var r2 = point2.getRange(point1);
  var d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  var d1 = (Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(d, 2)) / (2 * d);
  var c1 = Math.sqrt(Math.pow(r1, 2) - Math.pow(d1, 2));
  var centerX = (x2 - x1) * (d1 / d) + x1;
  var centerY = (y2 - y1) * (d1 / d) + y1;
  var vectorX = centerX - x1;
  var vectorY = centerY - y1;
  var normalY = -1 * vectorX / Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
  var normalX = vectorY / Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
  var intersect1 = [normalX * c1 + centerX, normalY * c1 + centerY];
  var intersect2 = [normalX * -c1 + centerX, normalY * -c1 + centerY];
  return [intersect1, intersect2];
}; // Find which of two points is closer to a third point.


var findCloserPoint = function findCloserPoint(locations, point) {
  return getDistance({
    position: locations[0]
  }, point) <= getDistance({
    position: locations[1]
  }, point) ? locations[0] : locations[1];
}; // Check if an edge is longer than the range of either of two radios.


var checkEdgeValidity = function checkEdgeValidity(edge) {
  return edge.length > edge.edge[0].getRange(edge.edge[1]) || edge.length > edge.edge[1].getRange(edge.edge[0]);
}; // Using a graph, bridge all relays which have invalid edges.


exports.FindBridgingRelays = function (graph) {
  graph.edges.forEach(function (edge) {
    if (checkEdgeValidity(edge)) {
      graph.removeEdge(edge);
      var newPoints = bridgeRelaysTwo(edge.edge[0], edge.edge[1]);
      newPoints.every(function (value, index, array) {
        graph.addEdge(new Edge(value, array[index + 1]));
        return index < array.length - 2;
      });
    }
  });
};

exports.FindBridgingRelaysOne = function (graph) {
  graph.edges.forEach(function (edge) {
    if (checkEdgeValidity(edge)) {
      graph.removeEdge(edge);
      var newPoints = bridgeRelays(edge.edge[0], edge.edge[1]);
      newPoints.every(function (value, index, array) {
        graph.addEdge(new Edge(value, array[index + 1]));
        return index < array.length - 2;
      });
    }
  });
};

exports.FindCentroids = function (graph) {
  //  For every point in the graph,
  graph.points.forEach(function (point) {
    if (point.type !== 'R') {
      // Get every edge attached to that point.
      graph.getEdges(point).forEach(function (edge) {
        // If either point attached to that edge has a range shorter than the edge itself,
        if (checkEdgeValidity(edge)) {
          var checkSecondEdge = function checkSecondEdge(checkPoint) {
            if (checkPoint.type !== 'R') {
              // Check every edge attached to the second point, 
              graph.getEdges(checkPoint).forEach(function (checkEdge) {
                // As long as the edge is not equal to the original edge, 
                if (!edge.equals(checkEdge)) {
                  // If either point attached to that edge has a range shorter than the edge itself.
                  if (checkEdgeValidity(checkEdge)) {
                    var point1 = checkEdge.edge[0];
                    var point2 = checkEdge.edge[1];
                    var point3 = point;
                    var centroid = new Point((point1.position[0] + point2.position[0] + point3.position[0]) / 3, (point1.position[1] + point2.position[1] + point3.position[1]) / 3, 0, 'R');
                    var edge1 = new Edge(point1, centroid);
                    var edge2 = new Edge(point2, centroid);
                    var edge3 = new Edge(point3, centroid); // console.log(edge1.strength, edge2.strength, edge3.strength, edge.strength, checkEdge.strength);

                    var roundToZero = function roundToZero(number) {
                      return number < 0 ? 0 : number;
                    }; // console.log(roundToZero(edge1.strength) + roundToZero(edge2.strength) + roundToZero(edge3.strength),
                    // roundToZero(edge.strength) + roundToZero(checkEdge.strength))


                    if (roundToZero(edge1.strength) + roundToZero(edge2.strength) + roundToZero(edge3.strength) < roundToZero(edge.strength) + roundToZero(checkEdge.strength)) {
                      graph.removeEdge(edge);
                      graph.removeEdge(checkEdge);
                      graph.addEdge(edge1);
                      graph.addEdge(edge2);
                      graph.addEdge(edge3);
                    }
                  }
                }
              });
            }
          };

          if (edge.edge[0].equals(point)) {
            checkSecondEdge(edge.edge[1]);
          } else {
            checkSecondEdge(edge.edge[0]);
          }
        }
      });
    }
  });
};

exports.FindThreeStars = function (graph) {
  //  For every point in the graph,
  graph.points.forEach(function (point) {
    if (point.type !== 'R') {
      // Get every edge attached to that point.
      graph.getEdges(point).forEach(function (edge) {
        // If either point attached to that edge has a range shorter than the edge itself,
        if (checkEdgeValidity(edge)) {
          var checkSecondEdge = function checkSecondEdge(checkPoint) {
            if (checkPoint.type !== 'R') {
              // Check every edge attached to the second point, 
              graph.getEdges(checkPoint).forEach(function (checkEdge) {
                // As long as the edge is not equal to the original edge, 
                if (!edge.equals(checkEdge)) {
                  // If either point attached to that edge has a range shorter than the edge itself.
                  if (checkEdgeValidity(checkEdge)) {
                    var point1 = checkEdge.edge[0];
                    var point2 = checkEdge.edge[1];
                    var point3 = point;

                    var applyCentroid = function applyCentroid(point1, point2, point3) {
                      // Find the intersection point of two point ranges which is closest to the third point.
                      var intersectionPoint = findCloserPoint(findIntersections(point1, point2), point3); // const minimumRange = Math.max(point1.range, point2.range, point3.range);
                      // const minimumRange = (point1.range + point2.range + point3.range) / 3;

                      if (checkWithinRange(point3, {
                        position: intersectionPoint
                      })) {
                        graph.removeEdge(edge);
                        graph.removeEdge(checkEdge);
                        var newPoint = new Point((point1.position[0] + point2.position[0] + point3.position[0]) / 3, (point1.position[1] + point2.position[1] + point3.position[1]) / 3, 0, 'R');
                        var minimumRange = Math.min(point1.getRange(newPoint), point2.getRange(newPoint), point3.getRange(newPoint));
                        newPoint.range = minimumRange;
                        graph.addEdge(new Edge(newPoint, point1));
                        graph.addEdge(new Edge(newPoint, point2));
                        graph.addEdge(new Edge(newPoint, point3));
                      }
                    };

                    var applyThreeStar = function applyThreeStar(point1, point2, point3) {
                      // Find the intersection point of two point ranges which is closest to the third point.
                      var intersectionPoint = findCloserPoint(findIntersections(point1, point2), point3);
                      graph.removeEdge(edge);
                      graph.removeEdge(checkEdge);
                      var newIntersection = new Point(intersectionPoint[0], intersectionPoint[1], point1.range < point2.range ? point1.range : point2.range, 'R');
                      graph.addEdge(new Edge(point1, newIntersection));
                      graph.addEdge(new Edge(point2, newIntersection));
                      var newPoints = [point3].concat(_toConsumableArray(bridgeRelays(point3, newIntersection)), [newIntersection]);
                      newPoints.every(function (value, index, array) {
                        graph.addEdge(new Edge(value, array[index + 1]));
                        return index < array.length - 2;
                      });
                    }; // Check all combinations of two points for an intersection.


                    if (checkIntersection(point1, point2) && !checkWithinRange(point1, point2) && !checkWithinRange(point2, point1)) {
                      applyCentroid(point1, point2, point3);
                    } else if (checkIntersection(point1, point3) && !checkWithinRange(point1, point3) && !checkWithinRange(point3, point1)) {
                      applyCentroid(point1, point3, point2);
                    } else if (checkIntersection(point2, point3) && !checkWithinRange(point2, point3) && !checkWithinRange(point3, point2)) {
                      applyCentroid(point2, point3, point1);
                    } // if (!isCentroidPlaced) {
                    //     let minDistance = 0;
                    //     let intersection = 0;
                    //     if (checkIntersection(point1, point2) && !checkWithinRange(point1, point2) && !checkWithinRange(point2, point1)) {
                    //         minDistance = getDistance(point1, point2);
                    //         intersection = 1;
                    //     } else if (checkIntersection(point1, point3) && !checkWithinRange(point1, point3) && !checkWithinRange(point3, point1)) {
                    //         if (getDistance(point1, point3) < minDistance) {
                    //             minDistance = getDistance(point1, point3);
                    //             intersection = 2;
                    //         }
                    //     } else if (checkIntersection(point2, point3) && !checkWithinRange(point2, point3) && !checkWithinRange(point3, point2)) {
                    //         if (getDistance(point2, point3) < minDistance) {
                    //             intersection = 3;
                    //         }
                    //     }
                    //     if (intersection === 1) {
                    //         applyThreeStar(point1, point2, point3);
                    //     } else if (intersection === 2) {
                    //         applyThreeStar(point1, point3, point2);
                    //     } else if (intersection === 3) {
                    //         applyThreeStar(point2, point3, point1);
                    //     }
                    // }

                  }
                }
              });
            }
          };

          if (edge.edge[0].equals(point)) {
            checkSecondEdge(edge.edge[1]);
          } else {
            checkSecondEdge(edge.edge[0]);
          }
        }
      });
    }
  });
}; // Using a graph, find and apply threestars for invalid edges.


exports.FindExtendedThreeStars = function (graph) {
  //  For every point in the graph,
  graph.points.forEach(function (point) {
    // Get every edge attached to that point.
    graph.getEdges(point).forEach(function (edge) {
      if (point.type !== 'R') {
        // If either point attached to that edge has a range shorter than the edge itself,
        if (checkEdgeValidity(edge)) {
          var checkSecondEdge = function checkSecondEdge(checkPoint) {
            if (checkPoint.type !== 'R') {
              // Check every edge attached to the second point, 
              graph.getEdges(checkPoint).forEach(function (checkEdge) {
                // As long as the edge is not equal to the original edge, 
                if (!edge.equals(checkEdge)) {
                  // If either point attached to that edge has a range shorter than the edge itself.
                  if (checkEdgeValidity(checkEdge)) {
                    var point1 = checkEdge.edge[0];
                    var point2 = checkEdge.edge[1];
                    var point3 = point;

                    var applyThreeStar = function applyThreeStar(point1, point2, point3) {
                      graph.removeEdge(edge);
                      graph.removeEdge(checkEdge);
                      var newPoint = new Point((point1.position[0] + point2.position[0] + point3.position[0]) / 3, (point1.position[1] + point2.position[1] + point3.position[1]) / 3, 10, 'R');
                      graph.addEdge(new Edge(newPoint, point1));
                      graph.addEdge(new Edge(newPoint, point2));
                      graph.addEdge(new Edge(newPoint, point3));
                    };

                    applyThreeStar(point1, point2, point3);
                  }
                }
              });
            }
          };

          if (edge.edge[0].equals(point)) {
            checkSecondEdge(edge.edge[1]);
          } else {
            checkSecondEdge(edge.edge[0]);
          }
        }
      }
    });
  });
};