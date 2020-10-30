from flask import Flask, request
from flask_cors import CORS
import json
import HardwareService
from HardwareService import Interface
app = Flask(__name__)
CORS(app, origin="http://localhost:5000")

# interface = Interface("COM12", 9600)
# interface.startListening()
# interface.startDebugging()

@app.route('/')
def index():
    pass

    
@app.route('/set-topology', methods=['POST'])
def setTopology():
    topology = {int(key): value for key, value in request.get_json()["topology"].items()}
    interface.topology = topology
    interface.rootNode = request.get_json()["root"]
    # interface.assignRoles();
    return {}


@app.route('/get-path', methods=['POST'])
def get_path():
    return { "path": [interface.rootNode] + interface.findPath(request.get_json()["node"])[::-1] }

@app.route('/run-network-test', methods=['GET'])
def runNetworkTest():
    return { "results": interface.runFullTestSequence() }

@app.route('/run-node-test', methods=['GET'])
def runNodeTest():
    nodeID = request.args.get("nodeID")
    ID = int(nodeID)
    return interface.runTestSequence(ID)
    try: 
        pass
    except:
        return { "results": "Failure" }

@app.route('/reportOnline', methods=['GET'])
def reportOnlineNodes():
    return { "nodes": interface.findOnlineNodes() }
