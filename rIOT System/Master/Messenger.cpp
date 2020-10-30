#include "Arduino.h"
#include "Messenger.h"

Messenger::Messenger() {
}

void Messenger::send(int message) {
    Serial.write(message);
}

int Messenger::listen() {
    if (Serial.available() > 0) {
        return Serial.read();
    } else {
        return -1;
    }
}

int* Messenger::listenForArray() {
    byte buffer;
    static int byteArr[32];
    int index = 0;
    if (Serial.available() == 32) {
        while (Serial.available() > 0) { // Wait for serial to receive 32 bytes.
            Serial.readBytes(&buffer, 1);
            byteArr[index] = (int)buffer;
            index++;
        }
    }
    return byteArr;
}
