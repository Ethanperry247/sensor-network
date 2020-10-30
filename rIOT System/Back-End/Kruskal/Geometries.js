const { obstruction } = require("./RangeCalculations");
const { getRange, powerloss } = require("./RangeCalculations");

let pointID = 1;

let greatestAttenuation = 0;

exports.setGreatestAttenuation = (value) => {
    greatestAttenuation = value;
};

exports.getGreatestAttenuation = () => {
    return greatestAttenuation;
};

exports.ResetPointIds = () => {
    pointID = 1;
};

exports.Obstruction = class Obstruction {
    constructor(x1, y1, x2, y2, attenuation) {
        this.positions = [[x1, y1], [x2, y2]];
        this.attenuation = typeof attenuation === "string" ? powerloss[attenuation] : attenuation;
    }

    checkIntersection(edge) {
        let determinate, gamma, lambda;
        const a = this.positions[0][0];
        const b = this.positions[0][1];
        const c = this.positions[1][0];
        const d = this.positions[1][1];
        const p = edge.edge[0].position[0];
        const q = edge.edge[0].position[1];
        const r = edge.edge[1].position[0];
        const s = edge.edge[1].position[1];
        determinate = (c - a) * (s - q) - (r - p) * (d - b);
        if (determinate === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / determinate;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / determinate;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }
};

exports.ObstructionCollection = class ObstructionCollection {
    constructor(obstructions) {
        this.obstructions = obstructions || new Array();
    }

    checkIntersection(edge) {
        return this.obstructions.reduce((acc, obstruction) => {
            if (obstruction.checkIntersection(edge)) {
                return (obstruction.attenuation + acc);
            } else {
                return acc;
            }
        }, 0);
    }

    checkNumIntersections(edge) {
        return this.obstructions.reduce((acc, obstruction) => {
            if (obstruction.checkIntersection(edge)) {
                return (++acc);
            } else {
                return acc;
            }
        }, 0);
    }

    addObstruction(obstruction) {
        this.obstructions.push(obstruction);
    }
};

exports.Obstructions = [
    new this.Obstruction(0, 0, 51.6875, 0, "Single Wall"),
    new this.Obstruction(-0.5, 0, -0.5, 33.0625, "Brick Barrier"),
    new this.Obstruction(0, 13.5, 27.5, 13.5, "Single Wall"),
    new this.Obstruction(39.5, 0, 39.5, 7.875, "Thick Barrier"),
    new this.Obstruction(51.6875, 0, 51.6875, 27.0625, "Brick Barrier"),
    new this.Obstruction(0, 33.0625, 27.0625, 33.0625, "Brick Barrier"),
    new this.Obstruction(31.125, 27.0625, 51.6875, 27.0625, "Single Wall"),
    new this.Obstruction(39.0625, 10.9375, 39.0625, 27.9375, "Single Wall"),
    new this.Obstruction(18.6875, 13, 18.6875, 10, "Single Wall"),
    new this.Obstruction(18.6875, 10, 26, 10, "Thick Barrier"),
    new this.Obstruction(26, 10, 27, 11, "Single Wall"),
    new this.Obstruction(27, 11, 27, 13, "Single Wall"),
    new this.Obstruction(18.6875, 16.625, 27.1875, 16.625, "Single Wall"),
    new this.Obstruction(18.6875, 13, 18.6875, 33.0625, "Single Wall"),
    new this.Obstruction(30.0625, 13, 39.125, 13, "Thick Barrier"),
    new this.Obstruction(27.1875, 16.625, 27.1875, 20, "Thin Barrier"),
    new this.Obstruction(27.1875, 20, 30.125, 23.5625, "Thin Barrier"),
    new this.Obstruction(27.1875, 20, 24.8125, 22.375, "Single Wall"),
    new this.Obstruction(24.8125, 22.375, 18.75, 22.375, "Single Wall"),
    new this.Obstruction(30.6875, 13.3125, 30.6875, 16.9375, "Thin Barrier"),
    new this.Obstruction(24.5625, 16.875, 24.5625, 22.125, "Single Wall"),
    new this.Obstruction(30.75, 23.75, 30.75, 27, "Single Wall"),
    new this.Obstruction(30.75, 27, 30.75, 33, "Brick Barrier"),
];

let ObstructionGraph = new this.ObstructionCollection(this.Obstructions);

exports.alterObstructionGraph = (obstructions) => {
    ObstructionGraph = new this.ObstructionCollection(obstructions);
};

exports.Point = class Point {
    constructor(positionX, positionY, range, type, ID) {
        this.position = [positionX, positionY];
        this.range = typeof range === "number" ? range : 10;
        this.range = Math.round(this.range * 1000) / 1000;
        this.type = range && type ? type : typeof range === "string" ? range : 'S';
        this.ID = ID || pointID;
        this.status = "offline";
        pointID++;
    }

    getRange(point) {
        return getRange(greatestAttenuation === 0 ? ObstructionGraph.checkIntersection({ edge: [this, point] }) : greatestAttenuation);
    }

    // Returns true if a duplicate is found.
    equals(point) {
        return point.position[0] === this.position[0] && point.position[1] === this.position[1];
    }

    asObject() {
        return {
            x: this.position[0],
            y: this.position[1],
        };
    }
};

exports.OctetPoint = class OctetPoint extends this.Point {
    constructor(ranges, positionX, positionY, range, type, ID) {
        super(positionX, positionY, range, type, ID);
        this.range = ranges;
    }

    getRange(point) {
        const angle = this.getAngle(point);
        return this.range[Math.floor((angle / 360) * 8)];
    }

    getAngle(point) {
        const angle = Math.atan2(point.position[1] - this.position[1], point.position[0] - this.position[0]) * 180 / Math.PI;
        return angle < 0 ? angle + 360 : angle;
    }
};

exports.Edge = class Edge {
    constructor(pointOne, pointTwo) {
        if (!pointOne.equals(pointTwo)) {
            this.edge = [pointOne, pointTwo];
            this.length = Math.round(Math.sqrt(Math.pow(Math.abs(pointOne.position[0] - pointTwo.position[0]), 2) +
                Math.pow(Math.abs(pointOne.position[1] - pointTwo.position[1]), 2)) * 1000) / 1000; // Rounded to four decimal places.
            this.attenuation = ObstructionGraph.checkIntersection(this);
            const range = getRange(this.attenuation);
            this.edgeConnected = this.length < range;
            this.strength = (this.length - range) / range;
            this.intersections = ObstructionGraph.checkNumIntersections(this);
        }
    }

    equals(edge) {
        let equal = true;
        if (edge.edge !== undefined) {
            edge.edge.forEach(point => {
                if (!(point.equals(this.edge[0]) || point.equals(this.edge[1]))) {
                    equal = false;
                }
            });
        } else {
            return false;
        }
        return equal;
    }
};

exports.Graph = class Graph {
    constructor() {
        this.numEdges = 0;
        this.numPoints = 0;
        this.totalLength = 0;
        this.graph = new Map(); // <Point, Edge[]> Relates a point to its connected edges.
        this.points = new Set(); // All points contained in the graph.
        this.edges = new Set(); // All edges contained in the graph.
    }

    removeEdge(edge) {
        this.edges.forEach(matchingEdge => {
            if (matchingEdge.equals(edge)) {
                this.edges.delete(matchingEdge);
            }
        });
        Array.from(this.graph.values()).forEach(edges => {
            edges.forEach((matchingEdge, index) => {
                if (matchingEdge.equals(edge)) {
                    edges.splice(index, 1);
                }
            });
        });
    }

    addEdge(edge) {
        if (!this.conatainsEdge(edge) && edge.edge !== undefined) {
            edge.edge.forEach(point => {
                let hasKey = false;
                this.graph.forEach((value, key) => {
                    if (key.equals(point)) {
                        this.graph.get(key).push(edge);
                        hasKey = true;
                    }
                });
                if (!hasKey) {
                    this.graph.set(point, [edge]);
                    this.points.add(point);
                    this.numPoints++;
                }
            });
            this.numEdges++;
            this.edges.add(edge);
            this.totalLength += edge.length;
        }
    }

    // Graphs should only be merged if fully separated.
    merge(graph) {
        this.graph = new Map([...this.graph, ...graph.graph]);
        this.numEdges += graph.numEdges;
        this.numPoints += graph.numPoints;
        this.totalLength += graph.totalLength;
        graph.edges.forEach(edge => {
            this.edges.add(edge);
        });
        graph.points.forEach(point => {
            this.points.add(point);
        });
    }

    // Check if this map contains an edge.
    conatainsEdge(edge) {
        return !Array.from(this.graph.values()).every(value => {
            return value.every(graphEdge => {
                return !graphEdge.equals(edge);
            });
        });
    }

    getEdges(point) {
        return Array.from(this.graph.entries()).find(entry => {
            if (entry[0].equals(point)) {
                return true;
            } else {
                return false;
            }
        })[1];
    }

    // Will return true if a point is contained in the graph.
    conatainsPoint(point) {
        return !Array.from(this.graph.keys()).every(value => {
            return !value.equals(point);
        });
    }

    prettyGraph() {
        return {
            graph: Array.from(this.graph.entries()).map(entry => {
                const key = entry[0];
                const value = entry[1];
                return {
                    point: key,
                    edges: value.map(edge => {
                        return {
                            length: edge.length,
                            points: edge.edge,
                        };
                    }),
                };
            }),
            points: Array.from(this.points.values()),
            edges: Array.from(this.edges.values()),
        };
    }

    prettyPointsAndEdges() {
        return {
            points: Array.from(this.points.values()),
            edges: Array.from(this.edges.values()),
        };
    }
};

exports.DisjointGraphSet = class DisjointGraphSet {
    constructor() {
        this.numGraphs = 0;
        this.graphs = [];
    }

    addEdge(edge) {
        if (edge.edge !== undefined) {
            if (this.numGraphs === 0) {
                this.graphs.push(new exports.Graph());
                this.graphs[0].addEdge(edge);
                this.numGraphs++;
                return true;
            }

            const firstPoint = this.graphs.findIndex(graph => graph.conatainsPoint(edge.edge[0]));
            const secondPoint = this.graphs.findIndex(graph => graph.conatainsPoint(edge.edge[1]));

            if (firstPoint === -1 && secondPoint === -1) {
                this.graphs.unshift(new exports.Graph());
                this.graphs[0].addEdge(edge);
                this.numGraphs++;
                return true;
            }

            if (firstPoint === secondPoint) {
                return false;
            }

            if (firstPoint === -1) {
                this.graphs[secondPoint].addEdge(edge);
                return true;
            }

            if (secondPoint === -1) {
                this.graphs[firstPoint].addEdge(edge);
                return true;
            }

            if (firstPoint > -1 && secondPoint > -1) {
                this.graphs[firstPoint].merge(this.graphs[secondPoint]);
                this.graphs[firstPoint].addEdge(edge);
                this.graphs.splice(secondPoint, 1);
                this.numGraphs--;
                return true;
            }
        }
    }

    prettyGraph() {
        return {
            numGraphs: this.numGraphs,
            graphs: this.graphs.map(graph => {
                return graph.prettyGraph();
            }),
        };
    }

    prettyPointsAndEdges() {
        return {
            numGraphs: this.numGraphs,
            graphs: this.graphs.map(graph => {
                return graph.prettyPointsAndEdges();
            }),
        };
    }
};