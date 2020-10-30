import serial
import time
import threading
import csv

testResults = dict()
onlineNodes = []
resultReceived = None
individualResults = []
altResults = []

def interpretResult(data: list):
    global individualResults
    global altResults
    print(data)
    if (len(data) > 2):
        if (data[1] < 30):
            timeMs = 0
            for index in range(1, len(data)):
                timeMs += data[index] * (10 ** (1 - index))
            individualResults.append(timeMs)
    altResults.append(data)

def toggleTestResult(node):
    global resultReceived
    resultReceived = {
        "time": time.monotonic()
    }

def toggleOnlineNodeResult(node: int):
    onlineNodes.append(node)

def respondToNetworkMessage(data: list):
    node = data[3]
    message = data[2]
    if (message == 112):
        toggleOnlineNodeResult(node)
    if (message == 113):
        toggleTestResult(node)

def consoleMessage(data: list):
    if (len(data) >= 4):
        print(f' *!*    (Alert) Message {data[2]} received from node {data[3]}.')
        respondToNetworkMessage(data)
    else:
        print("Incorrectly formatted message received.")

def consoleResults(data: list):
    try:
        testResults[data[5]] = {
            "Packets": data[4],
            "DurationMs": data[1] * 100 + data[2] + data[3]
        }
        print(f' *!*    (Alert) {data[4]} packets were received from node {data[5]} totaling {data[1] * 100 + data[2] + data[3]} milliseconds.')
    except:
        print(f' *!*    (Alert) Test Failed.')

# Each code will receive a corresponding confirmation code from the base station.
controlCodes = {
    -1: {
        "Name": "Invalid Code",
        "Description": "Warning: Invalid control code."
    },
    1: {
        "Name": "Reset Master",
        "Description": "Requesting a reset of the master node."
    },
    2: {
        "Name": "Reset Entire Network",
        "Description": "Base station node will send a command to every arduino in the network requesting a reset."
    },
    3: {
        "Name": "Reset Single Node",
        "Description": """Request that a specific node be reset. 
        A response will then be returned from the base station in which the base station must receive
        the ID of the node to be reset."""
    },
    4: {
        "Name": "Check Online Nodes",
        "Description": "Requesting that the base station reports all connected nodes."
    },
    5: {
        "Name": "Send Message",
        "Description": "The base station has been requested to send a sample message."
    },
    6: {
        "Name": "Test Entire Network",
        "Description": "The base station has been requested to preform a network test."
    },
    7: {
        "Name": "Test Individual Node",
        "Description": "The base station will request an individual node to preform a test."
    },
    8: {
        "Name": "Test Individual Node",
        "Description": "The base station will request an individual node to preform a test."
    },
    9: {
        "Name": "Collect Test Results",
        "Description": "The base station has been requested to report its test results."
    },
    255: {
        "Name": "Acknowledgement",
        "Description": "The base station has been alerted that its message was received."
    }
}

# The master computer must send a confirmation code upon receiving one of these codes.
infoCodes = {
    4: {
        "Name": "All Radios Reported",
        "Description": "The base station has finished reporting its nodes."
    },
    5: {
        "Name": "Message Path Required",
        "Description": "The base station has requested a path to deliver a message."
    },
    249: {
        "Name": "Individual Test Received",
        "Description": "A test result has been received from the base station.",
        "Function": interpretResult
    },
    250: {
        "Name": "Test Results Received",
        "Description": "A test result has been received from the base station.",
        "Function": consoleResults
    },
    251: {
        "Name": "Message From Network Member",
        "Description": "The base station has received a message from a network member.",
        "Function": consoleMessage
    },
    252: {
        "Name": "Finished Assembly",
        "Description": "The base station has finished assembling the network."
    },
    253: {
        "Name": "Network Assembling",
        "Description": "The base station is assembling the network."
    },
    254: {
        "Name": "Master Online",
        "Description": "The base station has reported that it is online and ready."
    },
    255: {
        "Name": "Acknowledgement",
        "Description": "The base station has acknowledged the request.",
        "Function": lambda arg: None
    }
}

class Interface:

    listener_paused = False
    stop_listening = False
    stop_cli = False
    ACK_CODE = 255

    def __init__(self, port=None, baud=9600):
        super().__init__()
        if (port is not None and baud is not None):
            self.com = serial.Serial(port=port, baudrate=baud, bytesize=8)
        self.rootNode = 1
        self.topology = {
            1: [2],
            2: [1, 3],
            3: [2, 4, 8],
            4: [3, 5],
            5: [4],
            11: [8],
            7: [4],
            8: [3, 9, 11],
            9: [8, 10],
            10: [9, 11],
            11: [10]
            # 9: [8, 10],
            # 10: [9],
        }

    def listen(self) -> list:
        return list(self.com.read(self.com.inWaiting()))

    def debug(self):
        return self.com.read(self.com.inWaiting())

    def printCode(self, code: int, dictionary: dict) -> None:
        print(f' *{code}*\t({"Incoming" if dictionary == infoCodes else "Outgoing"}) {dictionary[code]["Description"]}')

    def send(self, message) -> None:
        """ Will take either an int opcode or list of data to send to base station. """
        if (type(message) is int):
            message = [message]
        zeroList = [0] * (32 - len(message))
        message += zeroList
        if (message[0] in controlCodes):
            self.printCode(message[0], controlCodes)
            self.com.write(bytes(message))
        else:
            self.printCode(-1, controlCodes)

    def startDebugging(self):
        def loopListen():
            while (not self.stop_listening):
                message = self.debug()
                if (message):
                    print(message)
                    print("Debug:", list(message))
        thread = threading.Thread(target=loopListen)
        thread.start()

    def startListening(self):
        def loopListen():
            while (not self.stop_listening):
                if (not self.listener_paused):
                    message = self.listen()
                    if (message):
                        self.handleMessage(message)
                    time.sleep(0.15)
        thread = threading.Thread(target=loopListen)
        thread.start()

    def handleMessage(self, message):
        if (message[0] in infoCodes):
            self.printCode(message[0], infoCodes)
            if ("Function" in infoCodes[message[0]]):
                infoCodes[message[0]]["Function"](message)
            if (message[0] != 255):
                # self.send(self.ACK_CODE)
                pass

    def stopListening(self):
        self.stop_listening = True

    def startCLI(self):
        def CLI():
            while (not self.stop_cli):
                # message = input("Enter Message (or Q to Exit): \n")
                message = input()
                try:
                    messageInt = int(message)
                    self.send(messageInt)
                except:
                    if (message == "Q" or message == "q"):
                        self.quitProgram()
                    elif (message == "P" or message == "p"):
                        self.listener_paused = not self.listener_paused
                    elif (message == "s"):
                        self.runFullNetworkTest()
                    elif (message == "e"):
                        for key in self.topology.keys():
                            self.sendNetworkMessage(5, key)
                            time.sleep(0.2)
                    elif (message == "w"):
                        self.sendNetworkMessage(5, 6)
                    else:
                        print("Invalid input. Please try a number.")
        thread = threading.Thread(target=CLI)
        thread.start()

    def findOnlineNodes(self):
        global onlineNodes
        for key in self.topology.keys():
            if (key != self.rootNode):
                self.sendNetworkMessage(112, key)
                time.sleep(0.4)
        online = onlineNodes
        onlineNodes = []
        online.append(self.rootNode)
        self.send(1)
        return online
    
    def stopCLI(self):
        self.stop_cli = True
    
    def quitProgram(self):
        print("Quitting...")
        self.stopListening()
        self.stopCLI()
        self.com.close()

    def sendNetworkMessage(self, message, destination):
        path = self.findPath(destination) # Find the path for the message.
        path = [5, message] + path
        self.send(path)

    def assignRoles(self):
        for key in self.topology.keys():
            if (key != self.rootNode):
                self.send([5, 5, key]) # Tell the node it is time to adopt a new parent.
                path = self.findPath(key)
                if (len(path) == 1):
                    self.send([5, 1, key]) # Find the parent and send it over.
                elif (len(path) > 1):
                    self.send([5, path[1], key]) # Find the parent and send it over.

    def runNetworkTest(self, destination):
        path = self.findPath(destination)
        path = [7, 6] + path
        self.send(path)

    def runFullTestSequence(self):
        with open("resultsummary.csv", "w", newline='') as file:
            writer = csv.writer(file, delimiter=',')
            for key in self.topology.keys():
                if (key != self.rootNode):
                    result = self.runTestSequence(key)
                    writer.writerow([result["trials"], result["received"], result["averageTimeMs"]])
            file.close()

    def runTestSequence(self, destination):
        global individualResults 
        global altResults
        path = self.findPath(destination) # Find the path for the message.
        path = [8, 115] + path
        totalTrials = 500
        file = open(f'Node{destination}details.csv', 'w')
        writer = csv.writer(file, delimiter=',')
        for trials in range(0, totalTrials):
            global individualResults 
            global altResults
            startTime = time.monotonic()
            self.send(path)
            time.sleep(0.15)
            self.send(9)
            time.sleep(0.05)
            if (individualResults and altResults):
                writer.writerow([individualResults[-1], altResults[-1]])
            else:
                writer.writerow([0, 0])
        time.sleep(0.15)
        result = individualResults
        individualResults = []
        altResults = []
        file.close()
        return {
            "trials": totalTrials,
            "received": len(result),
            "averageTimeMs": sum(result) / len(result) if len(result) > 0 else 0
        }

    def alternativeTestSequence(self, destination):
        path = self.findPath(destination) # Find the path for the message.
        path = [8, 114] + path
        self.send(path)
        time.sleep(3)
        self.send(9)
        return {}


    def runFullNetworkTest(self):
        global testResults
        testResults = dict()
        self.send(1)
        time.sleep(1)
        for key in self.topology.keys():
            if (key != self.rootNode):
                self.runNetworkTest(key)
                time.sleep(3)
        print(testResults)
        self.send(1)
        return testResults

    def findPath(self, destination: int):
        path = []
        visited = set()
        def find(root):
            if (root not in visited):
                visited.add(root)
                if (destination in self.topology[root]):
                    return root;
                else:
                    for branch in self.topology[root]:
                        value = find(branch)
                        if (value is not None):
                            path.append(value)
                            return root
                    return None
            else:
                return None
        find(self.rootNode)
        path.insert(0, destination)
        return path


# interface = Interface("COM5", 9600)
# interface.startListening()
# interface.startDebugging()
# interface.startCLI()