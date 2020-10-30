void setup() {
    Serial.begin(9600);
}
void loop() {
    byte buffer;
    if (Serial.available() > 0) {
        Serial.readBytes(&buffer, 1);
        Serial.println((int)buffer);
    }
}