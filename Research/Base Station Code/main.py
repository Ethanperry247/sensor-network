from serial import Serial
from typing import List
from logger import Logger

class Device:

    def __init__(self, ID):
        super().__init__()
        device_ID: int = ID
        online_status: bool = True
        alarm_status: bool = False

    def get_ID(self):
        pass

class Network:

    def __init__(self, port='COM4', baud='115200'):
        super().__init__()
        arduino: Serial = serial.Serial(port, baud)

        # Demand a list of network devices.
        network_devices: List[Device] = getNetworkDevices()

        # Stop listening if instructed.
        stop_thread: bool = False

    # Sends a serial command to check if a particular device is online.
    def queryDeviceStatus(self, device: Device):
        try:
            pass
        except RuntimeError:
            pass

    def getNetworkSize(self):
        return len(self.network_devices)

    # Takes in a device and instructs the base station to send a message to that device.
    def sendMessage(self, device: Device):
        pass

    def getNetworkDevices(self):
        return self.network_devices

    # Listen to the serial port for any incoming data.
    def listen(self):
        while True:
            data = self.arduino.readline()
            # If any data is read, it will be sent to an interpreting method.
            if (data != None):
                interpret(data)

            # If the thread is to be stopped, stop listening.
            if (self.stop_thread):
                return
    
    def interpret(self, data):
        pass

    def stop_listening(self):
        self.stop_thread = True


# Error class to be implemented...
class Error(Exception):
    pass


arduino: Serial = Serial('COM8', '115200')
# arduino.flushInput()
# arduino.write(b'STOP')
while True:
    data = str(arduino.readline())
    print(data)

# while True:
#     data = arduino.read()
#     if (data):
#         print(data)

