import serial
import time
import threading
from base64 import b64encode, b64decode

# Control codes:

# Status Codes:
# 0 - Indicates 'okay' status.

class Node:

    def __init__(self, ID, address):
        super().__init__()
        self.ID = ID
        self.address = address

class Interface:

    def __init__(self, port='COM8', baud=9600):
        super().__init__()
        self.port = port
        self.com = serial.Serial(port, baud)
        time.sleep(1) # Give the device a moment to establish a connection.
        # self.refreshNetwork() # Refresh the network by restarting all nodes.

    def send_message(self, message):
        self.com.write((message + "\n").encode())

    def listen(self) -> str:
        message = self.com.read(self.com.inWaiting())
        try: 
            return message.decode("utf-8") # Try a UTF8 decoding.
        except: # If that fails...
            try:
                return b64encode(message).decode("utf-8") # Try a base 64 decoding.
            except:  # If that fails...
                return "Could not decipher message: " + message # Return the raw message.

    def refreshNetwork(self):
        print("Refreshing network...")
        self.send_message("RN") # Command to refresh the network.
        while True:
            time.sleep(0.5) # Wait for the message to come in.
            incoming_message = self.listen()
            if ("Refresh Finished." in incoming_message):
                print("Network Refresh Complete.")
                return
    
    def getNetworkSize(self):
        # Command that the hardware returns a valid network size.
        # Does not include itself.
        self.send_message("NS")

        # Boolean to wait for a valid response.
        valid_response = False
        size = 0

        # Until the network returns a valid network size, resend messages.
        while (not valid_response):
            time.sleep(0.1) # Wait half a second for a response.
            try:
                size = int(self.listen())
                valid_response = True
            except:
                self.send_message("NS")
        return size

    def getNodes(self):
        nodes = list()
        self.send_message("GN")
        time.sleep(1)
        node_strings = self.listen().split('\n')
        for node in node_strings:
            node_attributes = node.split('@')
            if node_attributes:
                nodes.append(Node(node_attributes[0], node_attributes[1]))
        return nodes

# Booleans to stop listening to or commanding the hardware.
stop_listener = False
stop_cli = False
interface = Interface('COM8', 9600)
interface.refreshNetwork()
print(interface.getNetworkSize())
print(interface.getNodes())

# #  Listener for the hardware interface.
# def listen():
#     global stop_listener
#     while (not stop_listener):
#         message = interface.listen()
#         if (message):
#             print(f'\n * Message from hardware: {message}')
#         time.sleep(0.4)


# # Command line interface for the hardware.
# listener = threading.Thread(target=listen)
# listener.start()

# def cli():
#     global stop_cli
#     while (not stop_cli):
#         send = input('Enter: ')
#         interface.send_message(send)

# commandLineInterface = threading.Thread(target=cli)
# commandLineInterface.start()