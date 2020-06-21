from serial import *

ser = Serial('COM10', 115200)

while ser.readline():
    print(str(ser.readline()).rstrip('\n'))