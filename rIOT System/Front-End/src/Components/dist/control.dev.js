"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignNewRoles = exports.reportOnlineNodes = exports.sendMessage = exports.runNodeTest = exports.runNetworkTest = exports.getPath = exports.setTopology = void 0;

var setTopology = function setTopology(topology) {
  fetch("http://localhost:3000/set-topology", {
    body: JSON.stringify(topology),
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log("Set topology successfully.");
  })["catch"](function (error) {
    console.log(error);
  });
};

exports.setTopology = setTopology;

var getPath = function getPath(nodeID) {
  return fetch("http://localhost:3000/get-path", {
    body: JSON.stringify({
      node: nodeID
    }),
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    return data.path;
  })["catch"](function (error) {
    console.log(error);
  });
};

exports.getPath = getPath;

var runNetworkTest = function runNetworkTest() {
  return fetch("http://localhost:3000/run-network-test").then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data.results);
    return data.results;
  })["catch"](function (error) {
    console.log(error);
  });
};

exports.runNetworkTest = runNetworkTest;

var runNodeTest = function runNodeTest(nodeID) {
  return fetch("http://localhost:3000/run-node-test?nodeID=" + nodeID).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    return data;
  })["catch"](function (error) {
    console.log(error);
  });
};

exports.runNodeTest = runNodeTest;

var sendMessage = function sendMessage(node, message) {
  return fetch("http://localhost:3000/message", {
    body: JSON.stringify({
      node: node,
      message: message
    }),
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    return data.path;
  })["catch"](function (error) {
    console.log(error);
  });
};

exports.sendMessage = sendMessage;

var reportOnlineNodes = function reportOnlineNodes() {
  return fetch("http://localhost:3000/reportOnline").then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data.nodes);
    return data.nodes;
  })["catch"](function (error) {
    console.log(error);
  });
};

exports.reportOnlineNodes = reportOnlineNodes;

var assignNewRoles = function assignNewRoles() {
  return fetch("http://localhost:3000/reportOnline").then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log("Successfully assigned new roles."); // console.log(data.nodes);
    // return data.nodes;
  })["catch"](function (error) {
    console.log(error);
  });
};

exports.assignNewRoles = assignNewRoles;