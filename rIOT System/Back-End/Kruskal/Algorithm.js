const { Graph, Point, Edge } = require("./Geometries.js");

// Get the distance between two points.
const getDistance = (point1, point2) => Math.sqrt(Math.pow(point1.position[0] - point2.position[0], 2) +
    Math.pow(point1.position[1] - point2.position[1], 2));

// Check if the range of two points intersect.
const checkIntersection = (point1, point2) => {
    const distance = getDistance(point1, point2);
    return distance < point1.getRange(point2) + point2.getRange(point1);
};

// Check if a point is inside of the range of another point.
const checkWithinRange = (point1, point2) => {
    const distance = getDistance(point1, point2);
    return distance < point1.getRange(point2);
};

// Find the points which bridge the distance between two points which are out of range.
const bridgeRelays = (point1, point2) => {
    const x = (point2.position[0] - point1.position[0]);
    const y = (point2.position[1] - point1.position[1]);
    const distance = getDistance(point1, point2);
    const normalVector = [
        x / distance,
        y / distance,
    ];
    const minRange = point1.getRange(point2) < point2.getRange(point1) ? point1.getRange(point2) : point2.getRange(point1);
    const numRelays = Math.ceil(distance / minRange);
    return [point1, ...[...Array(numRelays - 1).keys()].map((relay, index) => {
        const point =  new Point(point1.position[0] + normalVector[0] * (index + 1) * distance / numRelays,
            point1.position[1] + normalVector[1] * (index + 1) * distance / numRelays, minRange, 'R');
        return point;
    }), point2];
};

const bridgeRelaysTwo = (point1, point2) => {
    const x = (point2.position[0] - point1.position[0]);
    const y = (point2.position[1] - point1.position[1]);
    const distance = getDistance(point1, point2);
    const normalVector = [
        x / distance,
        y / distance,
    ];
    const minRange = point1.getRange(point2) < point2.getRange(point1) ? point1.getRange(point2) : point2.getRange(point1);
    const numRelays = Math.ceil(distance / minRange);
    const relays = [point1, ...[...Array(numRelays - 1).keys()].map((relay, index) => {
        const point =  new Point(point1.position[0] + normalVector[0] * (index + 1) * distance / numRelays,
            point1.position[1] + normalVector[1] * (index + 1) * distance / numRelays, minRange, 'R');
        return point;
    }), point2];
    let previous = relays[0];
    for (let index = 1; index < relays.length - 1; index++) {
        const edge = new Edge(previous, relays[index + 1]);
        if (edge.edgeConnected) {
            relays.splice(index, 1);
            index--;
        } else {
            previous = relays[index];
        }
    }
    return relays;
};

// Find the two intersections of two points.
const findIntersections = (point1, point2) => {
    const x1 = point1.position[0];
    const y1 = point1.position[1];
    const r1 = point1.getRange(point2);
    const x2 = point2.position[0];
    const y2 = point2.position[1];
    const r2 = point2.getRange(point1);
    const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const d1 = (Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(d, 2)) / (2 * d);
    const c1 = Math.sqrt(Math.pow(r1, 2) - Math.pow(d1, 2));
    const centerX = (x2 - x1) * (d1 / d) + x1;
    const centerY = (y2 - y1) * (d1 / d) + y1;
    const vectorX = centerX - x1;
    const vectorY = centerY - y1;
    const normalY = -1 * vectorX / Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
    const normalX = vectorY / Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));
    const intersect1 = [(normalX * c1) + centerX, (normalY * c1) + centerY];
    const intersect2 = [(normalX * -c1) + centerX, (normalY * -c1) + centerY];
    return [intersect1, intersect2];
};

// Find which of two points is closer to a third point.
const findCloserPoint = (locations, point) => {
    return getDistance({
        position: locations[0],
    }, point) <= getDistance({
        position: locations[1],
    }, point) ? locations[0]
        : locations[1];
};

// Check if an edge is longer than the range of either of two radios.
const checkEdgeValidity = (edge) => {
    return edge.length > edge.edge[0].getRange(edge.edge[1]) || edge.length > edge.edge[1].getRange(edge.edge[0]);
};

// Using a graph, bridge all relays which have invalid edges.
exports.FindBridgingRelays = (graph) => {
    const edgesToRemove = [];
    const edgesToAdd = [];
    graph.edges.forEach(edge => {
        if (checkEdgeValidity(edge)) {
            // graph.removeEdge(edge);
            edgesToRemove.push(edge);
            const newPoints = bridgeRelaysTwo(edge.edge[0], edge.edge[1]);
            newPoints.every((value, index, array) => {
                // graph.addEdge(new Edge(value, array[index + 1]));
                edgesToAdd.push(new Edge(value, array[index + 1]));
                return index < array.length - 2;
            });
        }
    });
    edgesToRemove.forEach(edge => {
        graph.removeEdge(edge);
    });
    edgesToAdd.forEach(edge => {
        graph.addEdge(edge);
    });
};

exports.FindBridgingRelaysOne = (graph) => {
    const edgesToRemove = [];
    const edgesToAdd = [];
    graph.edges.forEach(edge => {
        if (checkEdgeValidity(edge)) {
            // graph.removeEdge(edge);
            edgesToRemove.push(edge);
            const newPoints = bridgeRelays(edge.edge[0], edge.edge[1]);
            newPoints.every((value, index, array) => {
                // graph.addEdge(new Edge(value, array[index + 1]));
                edgesToAdd.push(new Edge(value, array[index + 1]));
                return index < array.length - 2;
            });
        }
    });
    edgesToRemove.forEach(edge => {
        graph.removeEdge(edge);
    });
    edgesToAdd.forEach(edge => {
        graph.addEdge(edge);
    });
};

exports.FindCentroids = (graph) => {
    //  For every point in the graph,
    graph.points.forEach(point => {
        if (point.type !== 'R') {
        // Get every edge attached to that point.
        graph.getEdges(point).forEach(edge => {
            // If either point attached to that edge has a range shorter than the edge itself,
                if (checkEdgeValidity(edge)) {
                    const checkSecondEdge = checkPoint => {
                        if (checkPoint.type !== 'R') {// Check every edge attached to the second point, 
                            graph.getEdges(checkPoint).forEach(checkEdge => {
                                // As long as the edge is not equal to the original edge, 
                                if (!edge.equals(checkEdge)) {
                                    // If either point attached to that edge has a range shorter than the edge itself.
                                    if (checkEdgeValidity(checkEdge)) {
                                        const point1 = checkEdge.edge[0];
                                        const point2 = checkEdge.edge[1];
                                        const point3 = point;
                                        const centroid = new Point((point1.position[0] + point2.position[0] + point3.position[0]) / 3,
                                                (point1.position[1] + point2.position[1] + point3.position[1]) / 3, 0, 'R');
                                        const edge1 = new Edge(point1, centroid);
                                        const edge2 = new Edge(point2, centroid);
                                        const edge3 = new Edge(point3, centroid);

                                        // console.log(edge1.strength, edge2.strength, edge3.strength, edge.strength, checkEdge.strength);

                                        const roundToZero = (number) => number < 0 ? 0 : number;

                                        // console.log(roundToZero(edge1.strength) + roundToZero(edge2.strength) + roundToZero(edge3.strength),
                                        // roundToZero(edge.strength) + roundToZero(checkEdge.strength))

                                        if (roundToZero(edge1.strength) + roundToZero(edge2.strength) + roundToZero(edge3.strength) < 
                                        roundToZero(edge.strength) + roundToZero(checkEdge.strength)) {
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

exports.FindThreeStars = (graph) => {
    //  For every point in the graph,
    graph.points.forEach(point => {
        if (point.type !== 'R') {
        // Get every edge attached to that point.
        graph.getEdges(point).forEach(edge => {
            // If either point attached to that edge has a range shorter than the edge itself,
                if (checkEdgeValidity(edge)) {
                    const checkSecondEdge = checkPoint => {
                        if (checkPoint.type !== 'R') {// Check every edge attached to the second point, 
                            graph.getEdges(checkPoint).forEach(checkEdge => {
                                // As long as the edge is not equal to the original edge, 
                                if (!edge.equals(checkEdge)) {
                                    // If either point attached to that edge has a range shorter than the edge itself.
                                    if (checkEdgeValidity(checkEdge)) {
                                        const point1 = checkEdge.edge[0];
                                        const point2 = checkEdge.edge[1];
                                        const point3 = point;
        
                                        const applyCentroid = (point1, point2, point3) => {
                                            // Find the intersection point of two point ranges which is closest to the third point.
                                            const intersectionPoint = findCloserPoint(findIntersections(point1, point2), point3);
                                            // const minimumRange = Math.max(point1.range, point2.range, point3.range);
                                            // const minimumRange = (point1.range + point2.range + point3.range) / 3;
                                            if (checkWithinRange(point3, { position: intersectionPoint })) {
                                                graph.removeEdge(edge);
                                                graph.removeEdge(checkEdge);
                                                const newPoint = new Point((point1.position[0] + point2.position[0] + point3.position[0]) / 3,
                                                    (point1.position[1] + point2.position[1] + point3.position[1]) / 3, 0, 'R');
                                                const minimumRange = Math.min(point1.getRange(newPoint), point2.getRange(newPoint), point3.getRange(newPoint));
                                                newPoint.range = minimumRange;
                                                graph.addEdge(new Edge(newPoint, point1));
                                                graph.addEdge(new Edge(newPoint, point2));
                                                graph.addEdge(new Edge(newPoint, point3));
                                            }
                                        };
        
                                        const applyThreeStar = (point1, point2, point3) => {
                                            // Find the intersection point of two point ranges which is closest to the third point.
                                            const intersectionPoint = findCloserPoint(findIntersections(point1, point2), point3);
                                            graph.removeEdge(edge);
                                            graph.removeEdge(checkEdge);
                                            const newIntersection = new Point(intersectionPoint[0], intersectionPoint[1], point1.range < point2.range ? point1.range : point2.range, 'R');
                                            graph.addEdge(new Edge(point1, newIntersection));
                                            graph.addEdge(new Edge(point2, newIntersection));
                                            const newPoints = [point3, ...bridgeRelays(point3, newIntersection), newIntersection];
                                            newPoints.every((value, index, array) => {
                                                graph.addEdge(new Edge(value, array[index + 1]));
                                                return index < array.length - 2;
                                            });
                                        }

                                        // Check all combinations of two points for an intersection.
                                        if (checkIntersection(point1, point2) && !checkWithinRange(point1, point2) && !checkWithinRange(point2, point1)) {
                                            applyCentroid(point1, point2, point3);
                                        } else if (checkIntersection(point1, point3) && !checkWithinRange(point1, point3) && !checkWithinRange(point3, point1)) {
                                            applyCentroid(point1, point3, point2);
                                        } else if (checkIntersection(point2, point3) && !checkWithinRange(point2, point3) && !checkWithinRange(point3, point2)) {
                                            applyCentroid(point2, point3, point1);
                                        }
        
                                        // if (!isCentroidPlaced) {
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
};

// Using a graph, find and apply threestars for invalid edges.
exports.FindExtendedThreeStars = (graph) => {
    //  For every point in the graph,
    graph.points.forEach(point => {
        // Get every edge attached to that point.
        graph.getEdges(point).forEach(edge => {
            if (point.type !== 'R') {
                // If either point attached to that edge has a range shorter than the edge itself,
                if (checkEdgeValidity(edge)) {
                    const checkSecondEdge = checkPoint => {
                        if (checkPoint.type !== 'R') {
                            // Check every edge attached to the second point, 
                            graph.getEdges(checkPoint).forEach(checkEdge => {
                                // As long as the edge is not equal to the original edge, 
                                if (!edge.equals(checkEdge)) {
                                    // If either point attached to that edge has a range shorter than the edge itself.
                                    if (checkEdgeValidity(checkEdge)) {
                                        const point1 = checkEdge.edge[0];
                                        const point2 = checkEdge.edge[1];
                                        const point3 = point;
                                        const applyThreeStar = (point1, point2, point3) => {
                                            graph.removeEdge(edge);
                                            graph.removeEdge(checkEdge);
                                            const newPoint = new Point((point1.position[0] + point2.position[0] + point3.position[0]) / 3,
                                                (point1.position[1] + point2.position[1] + point3.position[1]) / 3, 10, 'R');
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