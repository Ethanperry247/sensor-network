#ifndef Messenger_h
#define Messenger_h
#include "Arduino.h"


class Messenger {
    public:
        Messenger();
        void send(int message);
        int listen();
        int* listenForArray();
};

#endif
