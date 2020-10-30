"use strict";

var _this = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("./RangeCalculations"),
    obstruction = _require.obstruction;

var _require2 = require("./RangeCalculations"),
    _getRange = _require2.getRange,
    powerloss = _require2.powerloss;

var pointID = 1;
var greatestAttenuation = 0;

exports.setGreatestAttenuation = function (value) {
  greatestAttenuation = value;
};

exports.getGreatestAttenuation = function () {
  return greatestAttenuation;
};

exports.ResetPointIds = function () {
  pointID = 1;
};

exports.Obstruction =
/*#__PURE__*/
function () {
  function Obstruction(x1, y1, x2, y2, attenuation) {
    _classCallCheck(this, Obstruction);

    this.positions = [[x1, y1], [x2, y2]];
    this.attenuation = typeof attenuation === "string" ? powerloss[attenuation] : attenuation;
  }

  _createClass(Obstruction, [{
    key: "checkIntersection",
    value: function checkIntersection(edge) {
      var determinate, gamma, lambda;
      var a = this.positions[0][0];
      var b = this.positions[0][1];
      var c = this.positions[1][0];
      var d = this.positions[1][1];
      var p = edge.edge[0].position[0];
      var q = edge.edge[0].position[1];
      var r = edge.edge[1].position[0];
      var s = edge.edge[1].position[1];
      determinate = (c - a) * (s - q) - (r - p) * (d - b);

      if (determinate === 0) {
        return false;
      } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / determinate;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / determinate;
        return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
      }
    }
  }]);

  return Obstruction;
}();

exports.ObstructionCollection =
/*#__PURE__*/
function () {
  function ObstructionCollection(obstructions) {
    _classCallCheck(this, ObstructionCollection);

    this.obstructions = obstructions || new Array();
  }

  _createClass(ObstructionCollection, [{
    key: "checkIntersection",
    value: function checkIntersection(edge) {
      return this.obstructions.reduce(function (acc, obstruction) {
        if (obstruction.checkIntersection(edge)) {
          return obstruction.attenuation + acc;
        } else {
          return acc;
        }
      }, 0);
    }
  }, {
    key: "checkNumIntersections",
    value: function checkNumIntersections(edge) {
      return this.obstructions.reduce(function (acc, obstruction) {
        if (obstruction.checkIntersection(edge)) {
          return ++acc;
        } else {
          return acc;
        }
      }, 0);
    }
  }, {
    key: "addObstruction",
    value: function addObstruction(obstruction) {
      this.obstructions.push(obstruction);
    }
  }]);

  return ObstructionCollection;
}();

exports.Obstructions = [new (void 0).Obstruction(0, 0, 51.6875, 0, "Single Wall"), new (void 0).Obstruction(-0.5, 0, -0.5, 33.0625, "Brick Barrier"), new (void 0).Obstruction(0, 13.5, 27.5, 13.5, "Single Wall"), new (void 0).Obstruction(39.5, 0, 39.5, 7.875, "Thick Barrier"), new (void 0).Obstruction(51.6875, 0, 51.6875, 27.0625, "Brick Barrier"), new (void 0).Obstruction(0, 33.0625, 27.0625, 33.0625, "Brick Barrier"), new (void 0).Obstruction(31.125, 27.0625, 51.6875, 27.0625, "Single Wall"), new (void 0).Obstruction(39.0625, 10.9375, 39.0625, 27.9375, "Single Wall"), new (void 0).Obstruction(18.6875, 13, 18.6875, 10, "Single Wall"), new (void 0).Obstruction(18.6875, 10, 26, 10, "Thick Barrier"), new (void 0).Obstruction(26, 10, 27, 11, "Single Wall"), new (void 0).Obstruction(27, 11, 27, 13, "Single Wall"), new (void 0).Obstruction(18.6875, 16.625, 27.1875, 16.625, "Single Wall"), new (void 0).Obstruction(18.6875, 13, 18.6875, 33.0625, "Single Wall"), new (void 0).Obstruction(30.0625, 13, 39.125, 13, "Thick Barrier"), new (void 0).Obstruction(27.1875, 16.625, 27.1875, 20, "Thin Barrier"), new (void 0).Obstruction(27.1875, 20, 30.125, 23.5625, "Thin Barrier"), new (void 0).Obstruction(27.1875, 20, 24.8125, 22.375, "Single Wall"), new (void 0).Obstruction(24.8125, 22.375, 18.75, 22.375, "Single Wall"), new (void 0).Obstruction(30.6875, 13.3125, 30.6875, 16.9375, "Thin Barrier"), new (void 0).Obstruction(24.5625, 16.875, 24.5625, 22.125, "Single Wall"), new (void 0).Obstruction(30.75, 23.75, 30.75, 27, "Single Wall"), new (void 0).Obstruction(30.75, 27, 30.75, 33, "Brick Barrier")];
var ObstructionGraph = new (void 0).ObstructionCollection((void 0).Obstructions);

exports.alterObstructionGraph = function (obstructions) {
  ObstructionGraph = new _this.ObstructionCollection(obstructions);
};

exports.Point =
/*#__PURE__*/
function () {
  function Point(positionX, positionY, range, type, ID) {
    _classCallCheck(this, Point);

    this.position = [positionX, positionY];
    this.range = typeof range === "number" ? range : 10;
    this.range = Math.round(this.range * 1000) / 1000;
    this.type = range && type ? type : typeof range === "string" ? range : 'S';
    this.ID = ID || pointID;
    this.status = "offline";
    pointID++;
  }

  _createClass(Point, [{
    key: "getRange",
    value: function getRange(point) {
      return _getRange(greatestAttenuation === 0 ? ObstructionGraph.checkIntersection({
        edge: [this, point]
      }) : greatestAttenuation);
    } // Returns true if a duplicate is found.

  }, {
    key: "equals",
    value: function equals(point) {
      return point.position[0] === this.position[0] && point.position[1] === this.position[1];
    }
  }, {
    key: "asObject",
    value: function asObject() {
      return {
        x: this.position[0],
        y: this.position[1]
      };
    }
  }]);

  return Point;
}();

exports.OctetPoint =
/*#__PURE__*/
function (_this$Point) {
  _inherits(OctetPoint, _this$Point);

  function OctetPoint(ranges, positionX, positionY, range, type, ID) {
    var _this2;

    _classCallCheck(this, OctetPoint);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(OctetPoint).call(this, positionX, positionY, range, type, ID));
    _this2.range = ranges;
    return _this2;
  }

  _createClass(OctetPoint, [{
    key: "getRange",
    value: function getRange(point) {
      var angle = this.getAngle(point);
      return this.range[Math.floor(angle / 360 * 8)];
    }
  }, {
    key: "getAngle",
    value: function getAngle(point) {
      var angle = Math.atan2(point.position[1] - this.position[1], point.position[0] - this.position[0]) * 180 / Math.PI;
      return angle < 0 ? angle + 360 : angle;
    }
  }]);

  return OctetPoint;
}((void 0).Point);

exports.Edge =
/*#__PURE__*/
function () {
  function Edge(pointOne, pointTwo) {
    _classCallCheck(this, Edge);

    if (!pointOne.equals(pointTwo)) {
      this.edge = [pointOne, pointTwo];
      this.length = Math.round(Math.sqrt(Math.pow(Math.abs(pointOne.position[0] - pointTwo.position[0]), 2) + Math.pow(Math.abs(pointOne.position[1] - pointTwo.position[1]), 2)) * 1000) / 1000; // Rounded to four decimal places.

      this.attenuation = ObstructionGraph.checkIntersection(this);

      var range = _getRange(this.attenuation);

      this.edgeConnected = this.length < range;
      this.strength = (this.length - range) / range;
      this.intersections = ObstructionGraph.checkNumIntersections(this);
    }
  }

  _createClass(Edge, [{
    key: "equals",
    value: function equals(edge) {
      var _this3 = this;

      var equal = true;

      if (edge.edge !== undefined) {
        edge.edge.forEach(function (point) {
          if (!(point.equals(_this3.edge[0]) || point.equals(_this3.edge[1]))) {
            equal = false;
          }
        });
      } else {
        return false;
      }

      return equal;
    }
  }]);

  return Edge;
}();

exports.Graph =
/*#__PURE__*/
function () {
  function Graph() {
    _classCallCheck(this, Graph);

    this.numEdges = 0;
    this.numPoints = 0;
    this.totalLength = 0;
    this.graph = new Map(); // <Point, Edge[]> Relates a point to its connected edges.

    this.points = new Set(); // All points contained in the graph.

    this.edges = new Set(); // All edges contained in the graph.
  }

  _createClass(Graph, [{
    key: "removeEdge",
    value: function removeEdge(edge) {
      var _this4 = this;

      this.edges.forEach(function (matchingEdge) {
        if (matchingEdge.equals(edge)) {
          _this4.edges["delete"](matchingEdge);
        }
      });
      Array.from(this.graph.values()).forEach(function (edges) {
        edges.forEach(function (matchingEdge, index) {
          if (matchingEdge.equals(edge)) {
            edges.splice(index, 1);
          }
        });
      });
    }
  }, {
    key: "addEdge",
    value: function addEdge(edge) {
      var _this5 = this;

      if (!this.conatainsEdge(edge) && edge.edge !== undefined) {
        edge.edge.forEach(function (point) {
          var hasKey = false;

          _this5.graph.forEach(function (value, key) {
            if (key.equals(point)) {
              _this5.graph.get(key).push(edge);

              hasKey = true;
            }
          });

          if (!hasKey) {
            _this5.graph.set(point, [edge]);

            _this5.points.add(point);

            _this5.numPoints++;
          }
        });
        this.numEdges++;
        this.edges.add(edge);
        this.totalLength += edge.length;
      }
    } // Graphs should only be merged if fully separated.

  }, {
    key: "merge",
    value: function merge(graph) {
      var _this6 = this;

      this.graph = new Map([].concat(_toConsumableArray(this.graph), _toConsumableArray(graph.graph)));
      this.numEdges += graph.numEdges;
      this.numPoints += graph.numPoints;
      this.totalLength += graph.totalLength;
      graph.edges.forEach(function (edge) {
        _this6.edges.add(edge);
      });
      graph.points.forEach(function (point) {
        _this6.points.add(point);
      });
    } // Check if this map contains an edge.

  }, {
    key: "conatainsEdge",
    value: function conatainsEdge(edge) {
      return !Array.from(this.graph.values()).every(function (value) {
        return value.every(function (graphEdge) {
          return !graphEdge.equals(edge);
        });
      });
    }
  }, {
    key: "getEdges",
    value: function getEdges(point) {
      return Array.from(this.graph.entries()).find(function (entry) {
        if (entry[0].equals(point)) {
          return true;
        } else {
          return false;
        }
      })[1];
    } // Will return true if a point is contained in the graph.

  }, {
    key: "conatainsPoint",
    value: function conatainsPoint(point) {
      return !Array.from(this.graph.keys()).every(function (value) {
        return !value.equals(point);
      });
    }
  }, {
    key: "prettyGraph",
    value: function prettyGraph() {
      return {
        graph: Array.from(this.graph.entries()).map(function (entry) {
          var key = entry[0];
          var value = entry[1];
          return {
            point: key,
            edges: value.map(function (edge) {
              return {
                length: edge.length,
                points: edge.edge
              };
            })
          };
        }),
        points: Array.from(this.points.values()),
        edges: Array.from(this.edges.values())
      };
    }
  }, {
    key: "prettyPointsAndEdges",
    value: function prettyPointsAndEdges() {
      return {
        points: Array.from(this.points.values()),
        edges: Array.from(this.edges.values())
      };
    }
  }]);

  return Graph;
}();

exports.DisjointGraphSet =
/*#__PURE__*/
function () {
  function DisjointGraphSet() {
    _classCallCheck(this, DisjointGraphSet);

    this.numGraphs = 0;
    this.graphs = [];
  }

  _createClass(DisjointGraphSet, [{
    key: "addEdge",
    value: function addEdge(edge) {
      if (edge.edge !== undefined) {
        if (this.numGraphs === 0) {
          this.graphs.push(new exports.Graph());
          this.graphs[0].addEdge(edge);
          this.numGraphs++;
          return true;
        }

        var firstPoint = this.graphs.findIndex(function (graph) {
          return graph.conatainsPoint(edge.edge[0]);
        });
        var secondPoint = this.graphs.findIndex(function (graph) {
          return graph.conatainsPoint(edge.edge[1]);
        });

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
  }, {
    key: "prettyGraph",
    value: function prettyGraph() {
      return {
        numGraphs: this.numGraphs,
        graphs: this.graphs.map(function (graph) {
          return graph.prettyGraph();
        })
      };
    }
  }, {
    key: "prettyPointsAndEdges",
    value: function prettyPointsAndEdges() {
      return {
        numGraphs: this.numGraphs,
        graphs: this.graphs.map(function (graph) {
          return graph.prettyPointsAndEdges();
        })
      };
    }
  }]);

  return DisjointGraphSet;
}();