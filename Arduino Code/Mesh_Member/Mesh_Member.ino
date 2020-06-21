
#include "RF24.h"
#include "RF24Network.h"
#include "RF24Mesh.h"
#include <SPI.h>
#include <EEPROM.h>
//#include <printf.h>


/**** Configure the nrf24l01 CE and CS pins ****/
RF24 radio(9, 8);
RF24Network network(radio);
RF24Mesh mesh(radio, network);

/**
 * User Configuration: nodeID - A unique identifier for each radio. Allows addressing
 * to change dynamically with physical changes to the mesh.
 *
 * In this example, configuration takes place below, prior to uploading the sketch to the device
 * A unique value from 1-255 must be configured for each node.
 * This will be stored in EEPROM on AVR devices, so remains persistent between further uploads, loss of power, etc.
 *
 **/
#define nodeID 17

// Millisecond intervals at which this node sends status codes to the master node.
int milliDelay = 5000;

// Keeps track of time since the start of the program.
uint32_t displayTimer = 0;

void setup() {

  // Open up serial for debugging.
  Serial.begin(9600);
  Serial.println("Joining the network...");
  // Set the nodeID
  mesh.setNodeID(nodeID);
  mesh.begin();
  Serial.println("Successfully connected.");
}

void loop() {

  mesh.update();

  // Send a status code to the master node every five seconds.
  if (millis() - displayTimer >= milliDelay) {
    displayTimer = millis();
    
    uint32_t data = 0;
    
    Serial.println("Sending message: " + String(data));

    // Send an 'S' type message containing the current millis()
    if (!mesh.write(&data, 'S', sizeof(data))) {
      Serial.println("Failed Sending Message.");

      // If a write fails, check connectivity to the mesh network
      if (!mesh.checkConnection()) {
        //refresh the network address
        mesh.renewAddress();
      }
    }
  }

  // Load up an incoming message -- 0 indicates no message.
  uint32_t incomingMessage = receiveMessage();
  if (incomingMessage != 0) {

    // Print out the message.
    Serial.println(incomingMessage);

    // Refresh the network on a control code of 1.
    if (incomingMessage == 1) {
      refreshNetwork();
      uint32_t data = 1;
      mesh.write(&data, 'S', sizeof(data));
    }

    // Send an okay message back to the master controller upon a control code of 2.
    if (incomingMessage == 2) {
      uint32_t data = 0;
      mesh.write(&data, 'S', sizeof(data));
    }
  }
}

uint32_t receiveMessage() {
  uint32_t payload = 0;
  RF24NetworkHeader header;
  if (network.available()) {
    network.read(header, &payload, sizeof(payload));
  }
  return payload;
}

String refreshNetwork() {
  mesh.renewAddress();
}
