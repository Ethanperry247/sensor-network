
  
#include "RF24Network.h"
#include "RF24.h"
#include "RF24Mesh.h"
#include <SPI.h>
//Include eeprom.h for AVR (Uno, Nano) etc. except ATTiny
#include <EEPROM.h>

/***** Configure the chosen CE,CS pins *****/
RF24 radio(9,8);
RF24Network network(radio);
RF24Mesh mesh(radio,network);

uint32_t displayTimer = 0;

void setup() {
  Serial.begin(9600);

  // Set the nodeID to 0 for the master node
  mesh.setNodeID(0);
//  String startMessage = "Master Node ID: " + String(mesh.getNodeID());
//  Serial.println(startMessage);
  Serial.write(255);
  // Connect to the mesh
  mesh.begin();
  Serial.write(255);

}


void loop() {    

  // Call mesh.update to keep the network updated
  mesh.update();
  
  // In addition, keep the 'DHCP service' running on the master node so addresses will
  // be assigned to the sensor nodes
  mesh.DHCP();
  
  
  // Check for incoming data from the sensors
  if(network.available()){
    RF24NetworkHeader header;
    network.peek(header);

    uint32_t data;
    network.read(header,&data,sizeof(data)); 
    uint16_t fromNode = header.from_node;
    Serial.println("(" + String(data) + ")" + String(mesh.getNodeID(fromNode)) + "@" + String(fromNode));
  }

  // Relay data if commanded.
  String message = receiveSerialMessage();
  if (message == "RD") {
    relayData();
  } else if (message == "RN") {
    refreshNetwork();
  } else if (message.substring(0,2) == "SM") {
    // Format of SM command: SM[control code][device address]
    sendMessage((message.substring(2,4)).toInt(), (message.substring(4)).toInt());
  } else if (message == "NS") {
    Serial.println(mesh.addrListTop);
  } else if (message == "GN") {
    getNodes();
  }
}

// Sends a control code to a specific address on the network.
void sendMessage(uint32_t message, uint16_t id) {
  Serial.println("Sending message: " + String(message) + " To: " + String(id));
  mesh.write(id, &message, 'S', sizeof(message));
}

// Receives a serial message from the master computer.
String receiveSerialMessage() {
  if(Serial.available() > 0){
    return Serial.readStringUntil('\n');
  } else {
    return "";
  }
}

// Refreshing the network involves resetting every node on the network, which will update the addr list.
String refreshNetwork() {
  mesh.begin();
  Serial.println("Starting Refresh.");
  uint32_t reset = 1;
  for (int i = 0; i < 255; i++) {
    mesh.write(i, &reset, 'S', sizeof(reset));
  }
  Serial.println("Refresh Finished.");
}

void getNodes() {
  for(int i=0; i<mesh.addrListTop; i++){
       Serial.print(mesh.addrList[i].nodeID);
       Serial.print("@");
       Serial.println(mesh.addrList[i].address,OCT);
     }
}

// Relays data about the network back to the master computer.
void relayData() {
    Serial.println(" ");
    Serial.println(F("********Assigned Addresses********"));
     for(int i=0; i<mesh.addrListTop; i++){
       Serial.print("NodeID: ");
       Serial.print(mesh.addrList[i].nodeID);
       Serial.print(" RF24Network Address: 0");
       Serial.println(mesh.addrList[i].address,OCT);
     }
    Serial.println(F("**********************************"));
}
