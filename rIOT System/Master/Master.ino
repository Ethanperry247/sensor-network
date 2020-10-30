#include "RF24Network.h"
#include "RF24.h"
#include "RF24Mesh.h"
#include <SPI.h>
#include <EEPROM.h>

#define ACK_CODE 255
// ID 1 will always be set for the base station.
#define ID 1

// Configure radio and mesh network.
RF24 radio(9, 8);

// Incoming message from master computer.
int message[32];

// Variables for testing.
int startTime = 0;
int endTime = 0;
int packetsReceived = 0;

// A function which can reset the base station.
void (*resetFunc)(void) = 0;

void setup()
{
    Serial.begin(9600);
    Serial.write(253); // Bring radios online.
    initRadio();
    Serial.write(252); // Radios online.
    Serial.write(254); // Base station has finished initialization.
}

// Initializes the base station radio.
void initRadio()
{
    radio.begin();
    radio.setChannel(105);
    byte localAddress[6] = "00000";
    localAddress[4] = (char)ID; // Set the local address.
    radio.openReadingPipe(0, localAddress);
    radio.setPALevel(RF24_PA_MAX); // Lowest power level.
    radio.startListening();
}

void loop()
{
    listenForNetwork();
    listenForMaster();
}

void listenForMaster()
{
    if (Serial.available() == 32)
    { // Wait for a 32 byte packet from master.
        byte buffer;
        int index = 0;
        while (Serial.available() > 0)
        { // Wait for serial to receive 32 bytes.
            Serial.readBytes(&buffer, 1);
            message[index] = (int)buffer;
            index++;
        }
        // Use the first byte of the message as the control code.
        reactToMessage(message[0]);
    }
}

// Will take a message, buffer it with zeros, then send it to the master.
void sendToMaster(int message[], int length)
{
    char data[32];
    for (int index = 0; index < 32; index++)
    {
        if (index < length)
        {
            data[index] = (char)message[index];
        }
        else
        {
            data[index] = (char)0;
        }
    }
    // delay(100);
    // Serial.println("morestats");
    // Serial.print(data[0]);
    // Serial.print(data[1]);
    // Serial.print(data[2]);
    // Serial.print(data[3]);
    // Serial.print(data[4]);
    // Serial.print(data[5]);
    // delay(100);
    Serial.write(data);
}

// Sends a message to a particular network radio.
void sendToNetwork()
{
    char data[32];            // Data to send.
    int destinationIndex = 0; // Index of the destination node in the data array.
    for (int index = 1; index < 32; index++)
    {
        data[index - 1] = (char)message[index]; // Fill the data array.
        if (message[index] > 0)
        {
            destinationIndex = index - 1;
        }
    }
    int destination = data[destinationIndex]; // Get the destination node id.
    data[destinationIndex] = 0;               // Remove the destination node from the data array.
    // Serial.write(5); // Write to the master that the message has been interpreted and sent.
    byte address[6] = "00000";
    address[4] = (char)destination; // Sending to the first destination node.
    radio.openWritingPipe(address);
    radio.stopListening();
    radio.write(&data, sizeof(data));
    radio.startListening();
}

void collectTestResults() {
    int total = 0;
    if (endTime == 0) {
        total = 0;
    } else {
        total = endTime - startTime;
    }
    int data[5] = {249, total / 1000, (total % 1000) / 100, (total % 100) / 10, total % 10};
    sendToMaster(data, 5);
    startTime = 0;
    endTime = 0;
    packetsReceived = 0;
}

// Listens to the network for incoming messages.
void listenForNetwork()
{
    char data[32]; // Data to be sent to master.
    char text[32]; // Data coming from the network.
    for (int index = 0; index < 32; index++)
    {
        data[index] = (char)0;
    }
    if (radio.available())
    {
        radio.read(&text, sizeof(text));
        if ((int)text[1] == 115) {
            endTime = micros();
        } else if ((int)text[1] == 3) {
            packetsReceived++;
            Serial.print(3);
        } else if ((int)text[1] == 2) {
            endTime = millis();
        } else {
            data[0] = (char)251; // Control code for the master computer's understanding.
            for (int index = 1; index < 32; index++)
            {
                data[index] = text[index - 1];
            }
            Serial.write(data);
        }
    }
}

void requestTest()
{
    char text[32];
    for (int index = 0; index < 5; index++)
    {
        if (radio.available())
        {
            radio.read(&text, sizeof(text));
        }
    }
    sendToNetwork(); // Get the time of sending the first message.
    int start = millis();
    int received = 0;
    bool finished = false;
    while (!finished)
    {
        if (radio.available())
        {
            radio.read(&text, sizeof(text));
            if (text[1] == 2)
            { // If a message of 0 is received, the test is over.
                finished = true;
            }
            else if (text[1] == 3)
            {
                received++;
            }
        }
        // Wait a maximum of five seconds.
        if (millis() - start > 2000)
        {
            finished = true;
        }
    }
    // Serial.println(radio.available());
    int total = millis() - start;
    delay(500);
    int data[6] = {250, total / 100, total % 100, total % 10, received, message[2]};
    sendToMaster(data, 6);
    // Serial.println(radio.available());
    delay(100);
    for (int index = 0; index < 20; index++)
    {
        if (radio.available())
        {
            radio.read(&text, sizeof(text));
        }
    }
}

void reactToMessage(int message)
{
    if (message > -1 && message != 255)
    { // 255 is the acknowledgement code.
        // Serial.write(ACK_CODE); // Send an acknowledgement that a message was received.
        int temp[3] = {1, 2, 3};
        switch (message)
        {
        case 1: // Reset this node.
            reset();
            break;
        case 2:
            sendToMaster(temp, 3);
            break;
        case 3:
            break;
        case 4: // Report all network radios.
            break;
        case 5:
            sendToNetwork(); // Send a message.
            break;
        case 6:
            break;
        case 7:
            requestTest();
            break;
        case 8:
            startTime = micros();
            sendToNetwork();
            break;
        case 9:
            collectTestResults();
            break;
        }
    }
    serialFlush();
}

void reset()
{
    resetFunc();
}

void serialFlush()
{
    while (Serial.available() > 0)
    {
        char t = Serial.read();
    }
}