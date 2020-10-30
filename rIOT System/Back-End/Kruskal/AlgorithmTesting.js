const { Point, Edge, DisjointGraphSet, ResetPointIds, Obstructions, Obstruction, alterObstructionGraph, setGreatestAttenuation } = require("./Geometries.js");
const { FindExtendedThreeStars, FindBridgingRelays, FindBridgingRelaysOne, FindCentroids } = require("./Algorithm.js");
const { solve, generateConnectivityPriorityMST, generateMinDistancePriorityMST } = require("./Kruskal.js");

const generateRandomNodes = (amount, maxPositionX, maxPositionY) => {
    let ID = 1;
    points = []
    for (let index = 0; index < amount; index++) {
        const randomX = Math.floor(Math.random() * Math.floor(maxPositionX));
        const randomY = Math.floor(Math.random() * Math.floor(maxPositionY));
        const randomR = Math.floor(Math.random() * Math.floor(2 * Math.sqrt(maxPositionX * maxPositionY) / amount) + (2 * Math.sqrt(maxPositionX * maxPositionY) / amount));
        points.push(new Point(randomX, randomY, randomR, 'S', ID));
        ID++;
    }
    return points;
};

// Solve one offers better performance.
// Connectivity MST
const solveOne = (points, algorithm) => {
    let graph = generateConnectivityPriorityMST(points);
    graph = algorithm(graph);
    return graph.prettyPointsAndEdges();
};


// Min Distance MST
const solveTwo = (points, algorithm) => {
    let graph = generateMinDistancePriorityMST(points);
    graph = algorithm(graph);
    return graph.prettyPointsAndEdges();
};

// On average slightly better than the second implementation (by 0.01 - 0.1 of a node).
// As ranges become more varient, this algorithm becomes marginally more efficient (by ~0.2 of a node).
const implementationOne = (graph) => {
    FindCentroids(graph);
    graph = generateConnectivityPriorityMST(Array.from(graph.points));
    FindBridgingRelays(graph);
    return graph;
};

const implementationTwo = (graph) => {
    FindCentroids(graph);
    FindBridgingRelays(graph);
    return graph;
};

// Inefficienct as compared to one.
const implementationThree = (graph) => {
    FindCentroids(graph);
    graph = generateMinDistancePriorityMST(Array.from(graph.points));
    FindBridgingRelays(graph);
    return graph;
};

// Algorithm four is by far the best under certain conditions. If the max or average range is chosen for the three star, algorithm one will perform better.
const implementationFour = (graph) => {
    FindBridgingRelays(graph);
    return graph;
};
// Performs poorly.
const alternativeAlgorithmOne = (graph) => {
    FindCentroids(graph);
    FindBridgingRelaysOne(graph);
    return graph;
};

// Current Winner: Solve One Implementation One

const runIterations = (amount, trials, x, y) => {
    let firstImplementationRelayCount = 0;
    let secondImplementationRelayCount = 0;
    let attOne = 0;
    let attTwo = 0;
    let wallOne = 0;
    let wallTwo = 0;
    for (let index = 0; index < amount; index++) {
        const nodes = generateRandomNodes(trials, x, y);
        const two = solveOne(nodes, implementationFour);
        let greatestAttenuation = 0;
        two.edges.forEach(edge => {
            if (edge.attenuation > greatestAttenuation) {
                greatestAttenuation = edge.attenuation;
            }
        });
        setGreatestAttenuation(greatestAttenuation);
        const one = solveTwo(nodes, alternativeAlgorithmOne);
        setGreatestAttenuation(0);
        firstImplementationRelayCount += one.points.length;
        secondImplementationRelayCount += two.points.length;
        attOne += one.edges.reduce((prev, edge) => prev + edge.attenuation, 0);
        attTwo += two.edges.reduce((prev, edge) => prev + edge.attenuation, 0);
        wallOne += one.edges.reduce((prev, edge) => prev + edge.intersections, 0);
        wallTwo += two.edges.reduce((prev, edge) => prev + edge.intersections, 0);
    }
    firstImplementationRelayCount /= amount;
    secondImplementationRelayCount /= amount;
    attOne /= amount;
    attTwo /= amount;
    wallOne /= amount;
    wallTwo /= amount;
    console.log(`For ${amount} trials:`);
    console.log("First Implementation Average: " + (firstImplementationRelayCount - trials) + " | " + attOne + " | " + wallOne);
    console.log("Second Implementation Average: " + (secondImplementationRelayCount - trials) + " | " + attTwo + " | " + wallTwo);
};

const randomBarriers = (amount, trials, walls, x, y) => {
    const obstacles = Obstructions;
    const maxPositionX = x;
    const maxPositionY = y;
    const testObstructions = [];
    for (let index = 0; index < walls; index++) {
        const randomX1 = Math.floor(Math.random() * Math.floor(maxPositionX));
        const randomY1 = Math.floor(Math.random() * Math.floor(maxPositionY));
        const randomX2 = Math.floor(Math.random() * Math.floor(maxPositionX));
        const randomY2 = Math.floor(Math.random() * Math.floor(maxPositionY));
        const randomObstruction = Math.floor(Math.random() * 4);
        testObstructions.push(new Obstruction(randomX1, randomY1, randomX2, randomY2, 
            randomObstruction === 0 ? "Thin Barrier" 
                : randomObstruction === 1 ? "Thick Barrier"
                : randomObstruction === 2 ? "Single Wall"
                : "Brick Barrier"));
    }
    alterObstructionGraph(testObstructions);
    runIterations(amount, trials, x, y);
};

// runIterations(500, 10, 60, 40);
randomBarriers(1000, 30, 20, 100, 100);
