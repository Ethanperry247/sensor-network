const PriorityQueue = require("./PriorityQueue.js");
const { Point, Edge, DisjointGraphSet, ResetPointIds, Obstructions } = require("./Geometries.js");
const { FindExtendedThreeStars, FindBridgingRelays, FindCentroids } = require("./Algorithm.js");
const Arrangements = require("./PointArrangements.js");

const fillAllEdges = (points) => {
    const queue = new PriorityQueue();
    const edgeConnectedQueue = new PriorityQueue();
    for (let firstIndex = 0; firstIndex < points.length; firstIndex++) {
        for (let secondIndex = firstIndex + 1; secondIndex < points.length; secondIndex++) {
            const newEdge = new Edge(points[firstIndex], points[secondIndex]);
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

const prioritizeConnectivity = (points) => {
    const queue = new PriorityQueue();
    const edgeConnectedQueue = new PriorityQueue();
    for (let firstIndex = 0; firstIndex < points.length; firstIndex++) {
        for (let secondIndex = firstIndex + 1; secondIndex < points.length; secondIndex++) {
            const newEdge = new Edge(points[firstIndex], points[secondIndex]);
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

const prioritizeMinimumDistance = (points) => {
    const queue = new PriorityQueue();
    for (let firstIndex = 0; firstIndex < points.length; firstIndex++) {
        for (let secondIndex = firstIndex + 1; secondIndex < points.length; secondIndex++) {
            const newEdge = new Edge(points[firstIndex], points[secondIndex]);
            queue.enqueue(newEdge, newEdge.length);
        }
    }
    return queue;
};

// exports.solveTwo = (pointsArray) => {
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

exports.solve = (pointsArray, applyAlgorithm, algorithm) => {
    // ResetPointIds();
    // pointsArray = Arrangements.StrategicArrangement5;
    const startTime = process.hrtime.bigint();
    pointsArray = pointsArray.filter(point => {
        return point.type !== 'R';
    });
    const points = pointsArray.map(point => new Point(point.position[0], point.position[1], point.range, point.type, point.ID));
    let graph;
    if (applyAlgorithm) {
        graph = this.generateConnectivityPriorityMST(points);
        graph = algorithm ? algorithm(graph) : this.applyAlgorithms(graph);
    } else {
        graph = this.generateMinDistancePriorityMST(points);
    }
    // Obstructions.forEach(item => {
    //     graph.addEdge(new Edge(new Point(item.positions[0][0], item.positions[0][1], 0, 'S', 100), 
    //     new Point(item.positions[1][0], item.positions[1][1]), 0, 'S', 100));
    // });
    const totalTime = process.hrtime.bigint() - startTime;
    return {
        timeElapsedMs: Number(totalTime) / 1000000,
        graph: graph.prettyGraph()
    };
};

exports.generateConnectivityPriorityMST = (points) => {
    const graph = new DisjointGraphSet();
    const queue = prioritizeConnectivity(points);
    // const queue = prioritizeMinimumDistance(points);
    queue.elements.map(element => {
        graph.addEdge(element.data);
    });
    return graph.graphs[0];
};

exports.generateMinDistancePriorityMST = (points) => {
    const graph = new DisjointGraphSet();
    // const queue = prioritizeConnectivity(points);
    const queue = prioritizeMinimumDistance(points);
    queue.elements.map(element => {
        graph.addEdge(element.data);
    });
    return graph.graphs[0];
};

exports.applyAlgorithms = (graph) => {
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