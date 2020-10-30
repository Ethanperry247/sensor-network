#ifndef NetworkManager_h
#define NetworkManager_h
#include <SPI.h>
#include <EEPROM.h>
#include <nRF24L01.h>
#include "Arduino.h"
#include "Messenger.h"
#include "RF24.h"

class NetworkManager {
    public:
        NetworkManager();
        void updateNetwork(RF24 radio);
        void reportRadios(RF24 radio);
        void sendMessage(int message, int radioID, RF24 &radio);
        void broadcast(int message);
        void resetRadio(...);
        void resetNetwork();
        int listen(RF24 &radio);
};

#endif
