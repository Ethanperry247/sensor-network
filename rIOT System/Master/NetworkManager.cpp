#include "Arduino.h"
#include <SPI.h>
#include <EEPROM.h>
#include "NetworkManager.h"
#include "RF24.h"
#include "Messenger.h"

NetworkManager::NetworkManager() {
  
}

void NetworkManager::updateNetwork(RF24 radio) {

}

void NetworkManager::reportRadios(RF24 radio) {
    
}

void NetworkManager::sendMessage(int message, int radioID, RF24 &radio) {
    radio.stopListening();
    radio.openWritingPipe(radioID);
    radio.write(&message, sizeof(message));
    radio.startListening();
}

void NetworkManager::broadcast(int message) {

}

int NetworkManager::listen(RF24 &radio) {
    int data = 0;
    if (radio.available()) {
        radio.read(&data, sizeof(data));
    }
    return data;
}

// void NetworkManager::updateNetwork(RF24Mesh mesh) {
//    // Call mesh.update to keep the network updated
//    mesh.update();
   
//    // In addition, keep the 'DHCP service' running on the master node so addresses will
//    // be assigned to the sensor nodes
//    mesh.DHCP();
// }

// void NetworkManager::reportRadios(RF24Mesh mesh, Messenger messenger) {
//    if (mesh.addrListTop) { // If there are any addresses.
//        for(int i = 0; i < mesh.addrListTop; i++){ // Loop through the addresses to report them to the master.
//            messenger.send(250);
//            messenger.send((int)mesh.addrList[i].nodeID);
//            int message = 0;
//            while (message != 255) { // But wait for the master's acknowledgement of the radio.
//                message = messenger.listen();
//            }
//        }
//    }
//    messenger.send(4); // Finally, send the stop code.
//    int data = 10;
//    mesh.write(&data, 'M', sizeof(data), 2);
// }

// int NetworkManager::listen(RF24Network network) {
//     if(network.available()) {
//         RF24NetworkHeader header;
//         network.peek(header);
//         int data = 0;
//         if (header.type == 'M') {
//             network.read(header, &data, sizeof(data));
//         }
//         return data;
//     }
// }

// void NetworkManager::sendMessage(int message, int radioID) {

// }