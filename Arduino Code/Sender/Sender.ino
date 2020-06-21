// Include Libraries
#include <SPI.h>

// Radio libraries
#include <nRF24L01.h>
#include <RF24.h>

// Maximum devices/channels
#define MAX_CHANNELS 1000
#define ID 1


// Number of available channels.
int baseChannel = 10;
int totalChannels = 124;
int channelRange = totalChannels - baseChannel;
int localChannel = baseChannel + ID%channelRange;

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

  // Set the channel to the correct channel of this device.
  radio.setChannel(localChannel);
  
  // Set the address of this device (the local ID).
  radio.openWritingPipe(ID);
  
  //Set module as transmitter
  radio.stopListening();

  // Display power level and adjust power level if need be.
  Serial.println("Current Power Level (0-3): " + String(radio.getPALevel()));
  if (radio.getPALevel() == 0) {
    Serial.println("Resetting Power Level...");
    radio.setPALevel(RF24_PA_MAX);
  }

  // Display the data rate.
  Serial.println("Current max data rate: " + dataRate[radio.getDataRate()]);

  
}

// Listens for a message being sent to this local ID.
String receiveMessage() {
  // Open a reading pipe at the designated ID.
  radio.openReadingPipe(0, ID);

  // Begin listening on that reading pipe.
  radio.startListening();

  if(radio.available()) {
    char text[32] = {0};
    radio.read(&text, sizeof(text));
    return text;
  }
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

void sendMessage() {
  byte sAddress[6] = "50";
  radio.setChannel(50);
  radio.openWritingPipe(sAddress);
  radio.write("Hello", sizeof("Hello"));
}

void scanChannels() {
  for (int i = 1; i < MAX_CHANNELS; i++) {
    // Generate an address.
    byte destinationAddress[6];
    String(i).getBytes(destinationAddress, 6);
    Serial.println(String((char *)destinationAddress));

    // Set the corresponding channel.
//    radio.setChannel(50);
  
    // Send a message on this address.
    radio.openWritingPipe(localAddress);
    
    // Send the message.
    char text[32] = "Hello";
    radio.write(&text, sizeof(text));
    radio.startListening();
    if (radio.available()) {
      char newText[32] = {0};
      radio.read(&newText, sizeof(newText));
      Serial.println(String(newText));
      exit(0);
    }
    
  }
}
