// Include Libraries
#include <SPI.h>

// Radio libraries
#include <nRF24L01.h>
#include <RF24.h>

// Maximum devices/channels
#define MAX_CHANNELS 1000

//create an RF24 object
RF24 radio(9, 8);  // CE, CSN

// The base station will always have an ID of 0.
const byte localAddress[6] = {"00000"};

// Assignable data rates.
String dataRate[3] = {"1 MBPS", "2 MBPS", "250 KBPS"};

void setup()
{

  while (!Serial) {
    Serial.begin(9600);
  }
  
  radio.begin();

  //The base station will always transmit on channel 50.
  radio.setChannel(50);
  
  //set the address
  radio.openWritingPipe(localAddress);
  
  //Set module as transmitter
  radio.stopListening();

  // Display device information
  Serial.println("Hello, I am the Base Station.");
  Serial.println("My ID is: " + String((char *)localAddress));
  Serial.println("My channel is: " + String(radio.getChannel()));

  // Display power level and adjust power level if need be.
  Serial.println("Current Power Level (0-3): " + String(radio.getPALevel()));
  if (radio.getPALevel() == 0) {
    Serial.println("Resetting Power Level...");
    radio.setPALevel(RF24_PA_MAX);
  }

  // Display the data rate.
  Serial.println("Current max data rate: " + dataRate[radio.getDataRate()]);

  
}

void loop()
{
  int i = 0;
  char text[]= {char(i)};
  // Send message to receiver
  radio.write(&text, sizeof(text));
  // Serial.println("Sending Data Packet: " + String(text) );
//  scanChannels();
  scanChannels();
}

void writeSerialMessage(String message) {
  Serial.println(message);
}

void sendMessage() {
  byte sAddress[6] = "50";
  radio.setChannel(50);
  radio.openWritingPipe(sAddress);
  radio.write("Hello", sizeof("Hello"));
}
