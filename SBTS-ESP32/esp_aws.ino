#include <Arduino_BuiltIn.h>
#include "utils.h"
#include <PubSubClient.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

#define RX_PIN 16
#define TX_PIN 17

TinyGPSPlus gps;

String coordinates  , date  , Time ;
char* userId = "66039f064966efb9f22545e6";

void setup() {
  
    Serial.begin(115200);

    Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);

    connectAWS();
}

void loop() {
  
  
   while (Serial2.available() > 0) {
    if (gps.encode(Serial2.read())) {
      displayData();
    }
  }
}

void displayData() {
  if (gps.location.isValid()) {
    Serial.print("Latitude: ");
    Serial.println(gps.location.lat(), 6);
    Serial.print("Longitude: ");
    Serial.println(gps.location.lng(), 6);
    String lat = String(gps.location.lat(), 6) + " , " + String(gps.location.lng(), 6);
    Serial.println(lat);
   
   coordinates = lat;
    delay(300);
  } else {
    Serial.println("Location not available");
    coordinates = "Not available";
  }

  if (gps.date.isValid()) {
    Serial.print("Date: ");
    Serial.print(gps.date.month());
    Serial.print("/");
    Serial.print(gps.date.day());
    Serial.print("/");
    Serial.println(gps.date.year());
    String date1 = String(gps.date.month()) + " : " + String(gps.date.day()) + " : " + String(gps.date.year());
    Serial.println(date1);
    date = date1;
   

  } else {
    Serial.println("Date not available");
    date = " NOT AVAILABLE";
  }

  if (gps.time.isValid()) {
    Serial.print("Time: ");
    Serial.print(gps.time.hour());
    Serial.print(":");
    Serial.print(gps.time.minute());
    Serial.print(":");
    Serial.println(gps.time.second());
    Time = String(gps.time.hour()) + " : " + String(gps.time.minute()) + " : " + String(gps.time.second());
  } else {
    Serial.println("Time not available");
    Time = "NOT AVAILABLE";
  }

  Serial.print("Speed: ");
  Serial.println(gps.speed.kmph());

  String speed = String(gps.speed.kmph());
 

  Serial.println();
  
  publishMessage(coordinates.c_str(), userId);
  delay(5000);
  client.loop();
  delay(5000);
}


