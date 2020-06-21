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
const byte sAddress[6] = "50"; // Source address (local address).
const byte dAddress[6] = "00000"; // Destination address (remote address).


// Random ID generation.
long publicID;
long privateID;

// An LED for transmission/function and one for errors.
//int functionPin = 10;
//int errorPin = 8;
#define functionPin 5
#define errorPin 7

//device listening channel.
int deviceChannel = 50;

//device sending channel.
int destinationChannel = 50;

int i = 0;
unsigned long StartTime;
unsigned long CurrentTime = 0;

void setup() {

  pinMode(functionPin, OUTPUT);
  pinMode(errorPin, OUTPUT);

  // if analog input pin 0 is unconnected, random analog
  // noise will cause the call to randomSeed() to generate
  // different seed numbers each time the sketch runs.
  // randomSeed() will then shuffle the random function.
  randomSeed(analogRead(0));

  // Generate a random ID between 1 and 9999.
  // ID 0 is reserved for the base station.
  publicID = random(1, 10000);
  privateID = random(1, 100);
  
  while (!Serial);
    Serial.begin(9600);

  // Displays public and private IDs:
  Serial.println("Public ID: " + String(publicID));
  Serial.println("Private ID: " + String(privateID));
  
  radio.begin();

  //setting high channel for reduced interference
  radio.setChannel(deviceChannel);

  byte destinationAddress[6];
  String(50).getBytes(destinationAddress, 6);
  
  //sets all pipes to listen to.
  radio.openReadingPipe(0, destinationAddress);
  
  //Set module as receiver
  radio.startListening();
  StartTime = millis();
}

void loop() {
  
  //Read the data if available in buffer
  if (radio.available())
  {
    char text[32] = {0};
    radio.read(&text, sizeof(text));

    //for debugging purposes.
    Serial.println("Message received: " + String(text));

    i++;
    if (i%499 == 0) {
      CurrentTime = millis();
      Serial.println("Time Ellapsed: " + String((CurrentTime - StartTime)/1000.0) + " Seconds");
      StartTime = millis();
    }

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
