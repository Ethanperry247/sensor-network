export const setTopology = (topology) => {
    fetch("http://localhost:3000/set-topology", {
        body: JSON.stringify(topology),
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json()).then(data => {
        console.log("Set topology successfully.");
    }).catch(error => {
        console.log(error);
    });
};

export const getPath = (nodeID) => {
    return fetch("http://localhost:3000/get-path", {
        body: JSON.stringify({node: nodeID}),
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json()).then(data => {
        return data.path;
    }).catch(error => {
        console.log(error);
    });
};

export const runNetworkTest = () => {
    return fetch("http://localhost:3000/run-network-test"
    ).then(response => response.json()).then(data => {
        console.log(data.results);
        return data.results;
    }).catch(error => {
        console.log(error);
    });
};

export const runNodeTest = (nodeID) => {
    return fetch("http://localhost:3000/run-node-test?nodeID=" + nodeID
    ).then(response => response.json()).then(data => {
        console.log(data);
        return data;
    }).catch(error => {
        console.log(error);
    });
};

export const sendMessage = (node, message) => {
    return fetch("http://localhost:3000/message", {
        body: JSON.stringify({ node: node, message: message }),
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json()).then(data => {
        return data.path;
    }).catch(error => {
        console.log(error);
    });
};

export const reportOnlineNodes = () => {
    return fetch("http://localhost:3000/reportOnline"
    ).then(response => response.json()).then(data => {
        console.log(data.nodes);
        return data.nodes;
    }).catch(error => {
        console.log(error);
    });
};

export const assignNewRoles = () => {
    return fetch("http://localhost:3000/reportOnline"
    ).then(response => response.json()).then(data => {
        console.log("Successfully assigned new roles.");
        // console.log(data.nodes);
        // return data.nodes;
    }).catch(error => {
        console.log(error);
    });
};