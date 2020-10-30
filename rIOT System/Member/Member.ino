#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

// Local address of this node.
#define LOCAL 9
// Address of the root node.
#define ROOT_NODE 12
// Address of the parent node, or node one hop closer to the master.
#define PARENT 9

RF24 radio(9, 8); // CE, CSN
byte localAddress[6] = "00000";
byte parentAddress[6] = "00000";
int checkInTimeMs = 3000;
int testDelay = 1000;

void setup()
{
    localAddress[4] = (char)LOCAL; // Assign the local address.
    parentAddress[4] = (char)PARENT; // Assign the parent address.
    Serial.begin(9600);
    radio.begin();
    radio.setChannel(105);
    radio.openReadingPipe(0, localAddress); // Listening on the parent address.
    radio.setPALevel(RF24_PA_MAX); // Minimum power level.
    radio.startListening();
}

void loop()
{
    // Send a check in message to the master every predefined period of time.
//    if (millis() % checkInTimeMs == 0)
//    {
//        sendToBase(111, LOCAL);
//    }
    if (radio.available())
    {
        char text[32] = "";
        radio.read(&text, sizeof(text)); // Read in a message if available.
        if ((int)text[0] == ROOT_NODE) // If the message is destined for the root node, propagate it.
        {
            sendToBase((int)text[1], (int)text[2]);
        }
        else
        {
            int index = 0;
            char nextDestination;
            for (char item : text)
            {
                int newItem = item;
                if (newItem == 0)
                {
                    if (index == 1)
                    { // Implying that there is only one element in the array, interpret the message.
                        interpretMessage(text[0]);
                    }
                    else
                    {
                        // The next destination for the message.
                        nextDestination = text[index - 1];
                        // Remove that destination.
//                        Serial.print("Original message: ");
//                        Serial.println(text);
                        text[index - 1] = (char)0;
//                        Serial.print("Amended message: ");
//                        Serial.println(text);
//
//                        Serial.print("Next Destination: ");
//                        Serial.println((int)nextDestination);

                        // Set the next destination.
                        auto newAddress = localAddress;
                        newAddress[4] = nextDestination;

//                        Serial.print("Sending message to: ");
//                        Serial.println(newAddress[4]);
//                        Serial.print("Message contents: ");
//                        Serial.println(text);

                        // Send the amended message to the next destination.
                        radio.openWritingPipe(newAddress);
                        radio.stopListening();
                        radio.write(&text, sizeof(text));
                        radio.startListening();
                    }
                    break;
                }
                index++;
            }
        }
    }
}

// Called when a message destined for this node is received.
void interpretMessage(char message)
{
    switch ((int)message) {
        case 115:
            sendToBase(115, LOCAL);
            Serial.print("test");
            break;
        case 114:
            test();
            break;
        case 113:
            sendToBase(113, LOCAL);
            break;
        case 112:
            sendToBase(112, LOCAL);
            break;
        case 6:
            test();
            break;
        case 5:
            alterRelationship();
            break;
        default: 
            break;
    }
//    acknowledge();
}

void alterRelationship() {
    int newParent = 0;
    while(newParent == 0) {
       if (radio.available()) {
          char text[32] = "";
          radio.read(&text, sizeof(text)); // Read in a message if available.
          newParent = (int)text[0];
       }
    }
    parentAddress[4] = (char)newParent; // Assign the parent address.
    Serial.print("New Parent Set Successfully: ");
    Serial.println(newParent);
}

void acknowledge() {
    radio.openWritingPipe(parentAddress);
    radio.stopListening();
    char text[] = {(char)ROOT_NODE, (char)112, (char)LOCAL};
    radio.write(&text, sizeof(text));
    radio.startListening();
}

void test() {
    int iterations = 100;
    radio.openWritingPipe(parentAddress);
    radio.stopListening();
    char text[] = {(char)ROOT_NODE, (char)3, (char)LOCAL};
    for (int index = 0; index < iterations; index++) {
        radio.write(&text, sizeof(text));
        delayMicroseconds(testDelay);
    }
    char newText[] = {(char)ROOT_NODE, (char)2, (char)LOCAL};
    for (int index = 0; index < 5; index++) {
        radio.write(&newText, sizeof(newText));
        delayMicroseconds(testDelay);
    } 
    radio.startListening();
}

// Eithers sends or propagates a message to the base station.
void sendToBase(int message, int origin)
{
    radio.openWritingPipe(parentAddress);
    radio.stopListening();
    char text[] = {(char)ROOT_NODE, (char)message, (char)origin};
    radio.write(&text, sizeof(text));
    radio.startListening();
}
