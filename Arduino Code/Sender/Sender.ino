//Include Libraries
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

//create an RF24 object
RF24 radio(9, 8);  // CE, CSN

//address through which two modules communicate.
const byte address[6] = "00001";
int i = 0;

void setup()
{
  radio.begin();

  //Set channel of radio 2
  radio.setChannel(90);
  
  //set the address
  radio.openWritingPipe(address);
  
  //Set module as transmitter
  radio.stopListening();

  
}
void loop()
{
  i++;
  char text[]= {char(i)};
  // Send message to receiver
  radio.write(&text, sizeof(text));
  // Serial.println("Sending Data Packet: " + String(text) );
}
