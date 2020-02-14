//Include Libraries
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

//create an RF24 object
RF24 radio(9, 8);  // CE, CSN

//address through which two modules communicate.
const byte address[6] = "00005";
int i = 0;
unsigned long StartTime;
unsigned long CurrentTime = 0;

void setup()
{
  while (!Serial);
    Serial.begin(9600);
  
  radio.begin();

  //Setting high channel for reduced interference
  radio.setChannel(102);
  
  //set the address
  radio.openReadingPipe(0, address);
  
  //Set module as receiver
  radio.startListening();
  StartTime = millis();
}

void loop()
{
  //Read the data if available in buffer
  if (radio.available())
  {
    char text[32] = {0};
    radio.read(&text, sizeof(text));
    
    //for debugging purposes.
    //Serial.println("Message received: " + String(text));
    
    i++;
    if (i%499 == 0) {
      CurrentTime = millis();
      Serial.println("Time Ellapsed: " + String((CurrentTime - StartTime)/1000.0) + " Seconds");
      StartTime = millis();
    }
  }
}
