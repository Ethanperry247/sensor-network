<script>
    import Button from './Components/Button.svelte';
    import { setTopology } from './Components/control.js';
    import InputButton from './Components/InputButton.svelte';
    import { onMount } from "svelte";
    export let nodes;
    let disabled = false; // Variable used for throttling the resize event handler.
    let graph; // Graph to 'draw' on.
    let width; // Width of the graph.
    let height; // Height of the graph.
    // let points = [{
    //     position: [0, 1],
    //     ID: 0,
    //     type: 'N',
    //     range: 10,
    //     status: "offline"
    // }, {
    //     position: [2, 1],
    //     ID: 1,
    //     type: 'S',
    //     range: 10,
    //     status: "offline"
    // }, {
    //     position: [15, 1],
    //     ID: 2,
    //     type: 'S',
    //     range: 10,
    //     status: "offline"
    // }, {
    //     position: [4, 17],
    //     ID: 3,
    //     type: 'S',
    //     range: 10,
    //     status: "offline"
    // }, {
    //     position: [5, 3],
    //     ID: 4,
    //     type: 'S',
    //     range: 10,
    //     status: "offline"
    // }];
    let points = [{
        position: [5, 3],
        ID: 1,
        type: 'N',
        range: 10,
        status: "offline"
    }, {
        position: [6, 3],
        ID: 2,
        type: 'S',
        range: 10,
        status: "offline"
    }, {
        position: [7, 3],
        ID: 3,
        type: 'S',
        range: 10,
        status: "offline"
    }, {
        position: [8, 3],
        ID: 4,
        type: 'S',
        range: 10,
        status: "offline"
    }, {
        position: [9, 3],
        ID: 5,
        type: 'S',
        range: 10,
        status: "offline"
    }]
    let edges = [];
    let topology = [];
    let nodeID = points.length;
    let rootNodeID = 1;
    const nodeSize = 20; // Alters the size of the node on the graph.
    let maxPositionX = points.map(point => point.position).reduce((max, current) => current[0] > max ? current[0] : max, 0);
    let maxPositionY = points.map(point => point.position).reduce((max, current) => current[1] > max ? current[1] : max, 0);
    const offsetX = (position) => (position / maxPositionX) * (width - nodeSize);
    const offsetY = (position) => (position / maxPositionY) * (height - nodeSize);
    const inverseOffsetX = (location) => (location / (width - nodeSize)) * maxPositionX;
    const inverseOffsetY = (location) => (location / (height - nodeSize)) * maxPositionY;

    onMount(() => {
        graph = document.getElementById("graph");
        height = graph.getBoundingClientRect().height;
        width = graph.getBoundingClientRect().width;
        createGraph();
        addGraphListeners();
    });

    const setControlNodes = () => {
        nodes = points;
    };

    const generateRandomNodes = (amount) => {
        console.log(points);
        points = [];
        edges = [];
        let ID = 1;
        for (let index = 0; index < amount; index++) {
            console.log(ID);
            const randomX = Math.floor(Math.random() * Math.floor(maxPositionX));
            const randomY = Math.floor(Math.random() * Math.floor(maxPositionY));
            const randomR = Math.floor(Math.random() * Math.floor(2 * Math.sqrt(maxPositionX * maxPositionY) / amount) + (2 * Math.sqrt(maxPositionX * maxPositionY) / amount));
            addPoint(randomX, randomY, ID, randomR);
            ID++;
        }
        console.log(points);
        createGraph();
    };

    // Resizes the graph to conform to the nodes.
    const resize = () => {
        let maxX = points.map(point => point.position).reduce((max, current) => current[0] > max ? current[0] : max, 0);
        let maxY = points.map(point => point.position).reduce((max, current) => current[1] > max ? current[1] : max, 0);
        let changeGraph = false;
        if (maxX !== maxPositionX) {
            maxPositionX = maxX;
            changeGraph = true;
        }
        if (maxY !== maxPositionY) {
            maxPositionY = maxY;
            changeGraph = true;
        }
        if (changeGraph) {
            createGraph();
        }
    };

    // Checks if the new point is out of the dimensions and adjusts, then adds a point.
    const addPoint = (x, y, ID, range) => {
        let newPoint = {
            position: [x, y],
            ID: ID === undefined ? nodeID : ID,
            type: 'S',
            range: range === undefined ? 10 : range,
            status: 'offline'
        };
        points.push(newPoint);
        if (x > maxPositionX || y > maxPositionY) {
            resize();
        } else {
            graph.appendChild(createPoint(newPoint));
        }
        nodeID++;
    };

    // Changes the dimensions of the graph.
    const changeDimensions = (x, y) => {
        maxPositionX = x;
        maxPositionY = y;
        createGraph();
    };

    // Fetches an MST from the back end.
    const fetchMST = (type) => {
        if (points.length > 0) {
            fetch("http://localhost:8000/" + type, {
                body: JSON.stringify(points),
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(response => response.json()).then(data => {
                console.log(data);
                edges = data.graph.edges;
                points = data.graph.points;
                topology = data.graph.graph;
                createGraph();
            }).catch(error => {
                console.log(error);
            });
        }
    };

    // Throttled window event listener.
    window.addEventListener('resize', () => {
        if (disabled) {
            return;
        }
        disabled = true;
        height = graph.getBoundingClientRect().height;
        width = graph.getBoundingClientRect().width;
        createGraph();
        setTimeout(() => disabled = false, 10);
    });

    // Removes all children of the graph.
    const clearGraph = () => {
        while (graph.firstChild) {
            graph.removeChild(graph.lastChild);
        }
    };

    // Clears graph and erases data.
    const resetGraph = () => {
        clearGraph();
        nodeID = 1;
        points = [];
        edges = [];
        resize();
    };

    const removeEdges = () => {
        if (edges.length > 0) {
            edges = [];
            createGraph();
        }
    };

    // Removes a particular point from the graph.
    const removePoint = (x, y) => {
        points.splice(points.findIndex((point, index) => {
            if (point.position[0] === x && point.position[1] === y) {
                return true;
            }
            return false;
        }), 1);
        createGraph();
    };

    const removePointByID = (ID) => {
        points.splice(points.findIndex((point, index) => {
            if (point.ID === ID) {
                return true;
            }
            return false;
        }), 1);
        createGraph();
    };

    const getPointID = (x, y) => {
        return points.find(point => {
            if (point.position[0] === x && point.position[1] === y) {
                return true;
            }
            return false;
        }).ID;
    };

    const setPoint = (x1, y1, x2, y2) => {
        let ID = getPointID(x1, y1);
        removePointByID(ID);
        addPoint(x2, y2, ID);
        createGraph();
    };

    const setPointRange = (point, range) => {
        removePointByID(point.ID);
        addPoint(point.position[0], point.position[1], point.ID, range);
        createGraph();
    };

    const resetRootNode = (node) => {
        points.forEach((point, index) => {
            if (point.ID === node.ID) {
                point.type = 'N';
            } else {
                if (point.type === 'N') {
                    point.type = 'S';
                }
            }
        });
        rootNodeID = node.ID;
        createGraph();
    };

    const addDimensions = () => {
        const dimensions = document.createElement("div");
        dimensions.classList.add("dimensions");
        const spanX = document.createElement("span");
        const spanY = document.createElement("span");
        spanX.innerHTML = maxPositionX.toFixed(2);
        spanY.innerHTML = maxPositionY.toFixed(2);
        dimensions.innerHTML += "(";
        dimensions.appendChild(spanX);
        dimensions.innerHTML += ", ";
        dimensions.appendChild(spanY);
        dimensions.innerHTML += ")";
        graph.appendChild(dimensions);
    };

    // Clears the graph, draws points, then draws edges.
    const createGraph = () => {
        clearGraph();
        drawEdges();
        drawPoints();
        addDimensions();
    };

    const addGraphListeners = () => {
        graph.addEventListener('dblclick', (event) => {
            addPoint(inverseOffsetX(event.layerX - nodeSize/2), inverseOffsetY(event.layerY - nodeSize/2));
        });
    };
    
    // Draws points on the graph.
    const drawPoints = () => {
        points.forEach(point => {
            graph.appendChild(createPoint(point));
        });
    };

    // Draws edges on the graph.
    const drawEdges = () => {
        edges.forEach(edge => {
            graph.appendChild(createEdge(
                offsetX(edge.edge[0].position[0], width) + nodeSize / 2,
                offsetY(edge.edge[0].position[1], height) + nodeSize / 2,
                offsetX(edge.edge[1].position[0], width) + nodeSize / 2,
                offsetY(edge.edge[1].position[1], height) + nodeSize / 2
            ));
        });
    };

    // Creates a draggable point.
    const createPoint = (point, style) => {
        const container = document.createElement("div");
        const newPoint = document.createElement("div");
        let x = point.position[0];
        let y = point.position[1];
        let selected = false;
        let openMenu = false;
        newPoint.classList.add("point");
        if (point.type === 'N') {
            newPoint.classList.add("root");
        }
        if (point.type === 'R') {
            newPoint.classList.add("relay");
        }
        if (style) {
            newPoint.classList.add(style);
        }
        newPoint.style.setProperty("--position-x", offsetX(x) + "px");
        newPoint.style.setProperty("--position-y", offsetY(y) + "px");
        newPoint.ondragend = (drag) => {
            removeEdges();
            const x2 = drag.clientX - graph.getBoundingClientRect().left - nodeSize/2;
            const y2 = drag.clientY - graph.getBoundingClientRect().top - nodeSize/2;
            setPoint(x, y, inverseOffsetX(x2), inverseOffsetY(y2));
            newPoint.style.setProperty("--position-x", x2 + "px");
            newPoint.style.setProperty("--position-y", y2 + "px");
            x = inverseOffsetX(x2);
            y = inverseOffsetY(y2);
        };
        newPoint.draggable = true;
        const infoBubble = createInfoBubble(point);
        const range = createRangeBubble(point);
        newPoint.onclick = () => {
            if (!selected) {
                container.appendChild(range);
                selected = true;
            } else {
                container.removeChild(range);
                selected = false;
            }
        };
        newPoint.oncontextmenu = () => {
            if (!openMenu) {
                newPoint.appendChild(infoBubble);
                openMenu = true;
            } else {
                newPoint.removeChild(infoBubble);
                openMenu = false;
            }
            return false;
        };
        container.appendChild(newPoint);
        return container;
    };

    const createRangeBubble = (point) => {
        const range = document.createElement("div");
        range.classList.add("range");
        range.style.setProperty("--position-x", offsetX(point.position[0]) + "px");
        range.style.setProperty("--position-y", offsetY(point.position[1]) + "px");
        range.style.setProperty("--width", offsetX(point.range * 2) + "px");
        range.style.setProperty("--height", offsetY(point.range * 2) + "px");
        let vector = [];
        let magnitude = 0;
        const getCenter = () => {
            const rect = range.getBoundingClientRect();
            return [(rect.right - rect.left) / 2 + rect.left, (rect.bottom - rect.top) / 2 + rect.bottom];
        };
        const getMagnitude = (x, y) => {
            return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        };
        range.ondragstart = (event) => {
            vector = [offsetX(point.position[0]) + graph.getBoundingClientRect().left, offsetY(point.position[1]) + graph.getBoundingClientRect().top];
        
            event.dataTransfer.setDragImage(new Image(), 0, 0);
        };
        range.ondrag = (event) => {
            magnitude = Math.sqrt(Math.pow(inverseOffsetX(event.clientX - vector[0] - 10), 2) + 
                Math.pow(inverseOffsetY(event.clientY - vector[1] - 10), 2));
            range.style.setProperty("--width", 2 * offsetX(magnitude) + "px");
            range.style.setProperty("--height", 2 * offsetY(magnitude) + "px");
        };
        range.ondragend = (event) => {
            magnitude = Math.sqrt(Math.pow(inverseOffsetX(event.clientX - vector[0] - 10), 2) + 
                Math.pow(inverseOffsetY(event.clientY - vector[1] - 10), 2));
            setPointRange(point, magnitude);
        };
        range.draggable = true;
        return range;
    };

    const createInfoBubble = (point) => {
        const infoBubble = document.createElement("div");
        infoBubble.classList.add("info-bubble");
        const infoBubbleId = document.createElement("h3");
        infoBubbleId.innerHTML = "Node " + point.ID;
        const infoBubbleCoordinates = document.createElement("p");
        const setRootNode = document.createElement("a");
        setRootNode.classList.add("add-root");
        setRootNode.innerHTML = "Set As Root";
        setRootNode.onclick = () => resetRootNode(point);
        const deleteNode = document.createElement("a");
        deleteNode.classList.add("delete");
        deleteNode.innerHTML = "Delete Node";
        deleteNode.onclick = () => {
            removeEdges();
            removePoint(point.position[0], point.position[1]);
        };
        infoBubbleCoordinates.innerHTML = `X: ${point.position[0].toFixed(2)}, Y: ${point.position[1].toFixed(2)}, R: ${point.range.toFixed(2)}`;
        infoBubble.appendChild(infoBubbleId);
        infoBubble.appendChild(infoBubbleCoordinates);
        infoBubble.appendChild(setRootNode);
        infoBubble.appendChild(document.createElement("br"));
        infoBubble.appendChild(deleteNode);
        return infoBubble;
    };

    // Creates an edge.
    const createEdge = (x1, y1, x2, y2) => {
        const newEdge = document.createElement("div");
        newEdge.classList.add("edge");

        const a = x1 - x2,
            b = y1 - y2,
            length = Math.sqrt(a * a + b * b);

        const midpointX = (x1 + x2) / 2,
            midpointY = (y1 + y2) / 2;

        const x = midpointX - length / 2,
            y = midpointY;

        const angle = Math.PI - Math.atan2(-b, a);

        newEdge.style.setProperty("--start-x", x + "px");
        newEdge.style.setProperty("--start-y", y + "px");
        newEdge.style.setProperty("--length", length + "px");
        newEdge.style.setProperty("--rotation", angle + "rad");
        return newEdge;
    };
</script>

<section>
    <div class="graph-container">
        <div id="graph" class="shadow network-graph"></div>
    </div>
    <div class="ui-container">
        <Button button={{
            name: "Generate MST",
            func: () => fetchMST("mst")
        }}></Button>
        <Button button={{
            name: "Apply Algorithm",
            func: () => fetchMST("solve")
        }}></Button>
        <Button button={{
            name: "Reset Graph",
            func: resetGraph
        }}></Button>
        <Button button={{
            name: "Add Node at Origin",
            func: () => addPoint(0, 0)
        }}></Button>
        <Button button={{
            name: "Set Nodes for Control",
            func: () => {
                setControlNodes();
                setTopology({
                    topology: topology.reduce((obj, entry) => {
                        return {
                            ...obj,
                            [entry.point.ID]: entry.edges.map(edge => {
                                return edge.points[0].ID === entry.point.ID ? edge.points[1].ID : edge.points[0].ID;
                            }),
                        };
                    }, {}),
                    root: rootNodeID
                });
            }
        }}></Button>
        <InputButton button={{
            name: "Generate Random Nodes",
            inputs: [{
                value: "Amt"
            }],
            func: (values) => {
                const amount = Number(values[0]);
                if (amount) {
                    generateRandomNodes(amount);
                }
            },
        }}></InputButton>
        <InputButton button={{
            name: "Add Node at Location",
            inputs: [{
                value: "X"
            }, {
                value: "Y"
            }],
            func: (values) => {
                const x = Number(values[0]);
                const y = Number(values[1]);
                if (x && y) {
                    addPoint(x, y);
                }
            },
        }}></InputButton>
        <InputButton button={{
            name: "Change Dimensions",
            inputs: [{
                value: "X"
            }, {
                value: "Y"
            }],
            func:(values) => {
                const x = Number(values[0]);
                const y = Number(values[1]);
                if (x && y) {
                    changeDimensions(x, y);
                }
            },
        }}></InputButton>
    </div>
</section>

<style>

    .ui-container {
        padding: 0 15px;
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
    }

    .graph-container {
        width: 100%;
        height: 80vh;
        padding: 20px;
        box-sizing: border-box;
    }

    .network-graph {
        box-sizing: border-box;
        border: solid var(--color-primary);
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background-color: var(--color-font-2);
    }

    :global(.network-graph .point) {
        position: absolute;
        height: 20px;
        width: 20px;
        background-color: black;
        border-radius: 50%;
        box-shadow: 0 0 3px grey;
        --position-x: 0;
        --position-y: 0;
        left: var(--position-x);
        top: var(--position-y);
        z-index: 100;
    }

    :global(.network-graph .range) {
        cursor: pointer;
        --position-x: 0;
        --position-y: 0;
        left: var(--position-x);
        top: var(--position-y);
        --height: 100px;
        --width: 100px;
        position: absolute;
        min-height: var(--height);
        min-width: var(--width);
        transform: translate(calc(-1 * var(--width) / 2 + 10px), calc(-1 * var(--height) / 2 + 10px));
        border-radius: 50%;
        border: dotted 1px black;
    }

    :global(.network-graph .range:hover) {
        border-color: var(--color-secondary);
    }

    :global(.network-graph .point.root) {
        background-color: var(--color-secondary);
    }

    :global(.network-graph .point.relay) {
        background-color: var(--color-tertiary);
    }

    :global(.network-graph .point:hover) {
        cursor: pointer;
    }

    :global(.network-graph .dimensions) {
        position: absolute;
        right: 0;
        bottom: 0;
    }

    :global(.network-graph .dimensions span) {
        cursor: pointer;
    }

    :global(.context-menu) {
        --x: 0;
        --y: 0;
        position: fixed;
        top: var(--y);
        left: var(--x);
        box-shadow: 0 0 3px var(--color-shadow);
        border: solid black;
        background-color: var(--color-font-2);
    }

    :global(.context-menu p) {
        padding: 3px;
    }

    :global(.network-graph .point .info-bubble) {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 150px;
        z-index: 9999;
        box-shadow: 0 0 3px var(--color-shadow);
        border: solid black;
        background-color: var(--color-font-2);
    }

    :global(.network-graph .point .info-bubble h3, .network-graph .point .info-bubble p) {
        padding: 3px;
        margin: 0;
        color: var(--color-font);
    }
    
    :global(.network-graph .point .info-bubble .add-root) {
        padding: 3px;
        color: var(--color-secondary);
    }

    :global(.network-graph .point .info-bubble .delete) {
        padding: 3px;
        color: var(--color-exit-button);
    }

    :global(.network-graph .edge) {
        position: absolute;
        z-index: 0;
        height: 2px;
        /* border: 1.5px lightgrey solid; */
        background-color: lightgrey;
        --start-x: 0;
        --start-y: 0;
        --length: 0;
        --rotation: 0;
        width: var(--length);
        top: var(--start-y);
        left: var(--start-x);
        transform: rotate(var(--rotation));
    }
</style>