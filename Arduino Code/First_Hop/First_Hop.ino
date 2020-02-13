//Include Libraries
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

//create an RF24 object
RF24 radio(9, 8);  // CE, CSN

//address through which modules communicate.
const byte sourceAddress[][6] = {"00001", "00002", "00003", "00004", "00005", "00006"};
const byte destinationAddress[][6] = {"00001", "00002", "00003", "00004", "00005", "00006"};


int offset = 3; // Offset the radio channel for stringing multiple hops together.
const byte sAddress[6] = "00004"; // Source address (local address).
const byte dAddress[6] = "00005"; // Destination address (remote address).


//device listening channel.
int deviceChannel = 90 + offset;

//device sending channel.
int destinationChannel = 91 + offset;

void setup() {
  while (!Serial);
    Serial.begin(9600);
  
  radio.begin();

  //setting high channel for reduced interference
  radio.setChannel(deviceChannel);
  
  //sets all pipes to listen to.
  // for (int i = 0; i < 6; i++)
  radio.openReadingPipe(0, sAddress);
  
  //Set module as receiver
  radio.startListening();
}

void loop() {
  //Read the data if available in buffer
  if (radio.available())
  {
    char text[32] = {0};
    radio.read(&text, sizeof(text));

    //for debugging purposes.
    Serial.println("Message received: " + String(text));

    //Set module as transmitter
    radio.stopListening();

    //setting alternate channel for reduced interference.
    radio.setChannel(destinationChannel);
    
    //Prepare to send a message out to the final destination device.
    radio.openWritingPipe(dAddress);

    //Send message to receiver
    radio.write(&text, sizeof(text));

    //Switch back to receiving mode
    radio.startListening();

    radio.setChannel(deviceChannel);
  }
}
