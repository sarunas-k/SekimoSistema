/* CODE for GPS module, GPRS shield and Arduino Uno. Code obtains coordinates from current position, sends them trough URL to the server, and obtains commands from http */
/* KTU 2016 */
/* Ignas Savukynas IF 4/1 */
/* Ðarûnas Kybartas IF 4/1 */
/* Tomas Sasnauskas IF 4/1 */

#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <String.h>

static const int RXPin = 10, TXPin = 11; //GPS module pins
static const int GPSBaud = 19200; //GPS baud rate
bool OnOff = true; //if GPRS shield is turned off, make it false
SoftwareSerial gprsSS(7, 8); //GPRS shield pins

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

void setup()
{ 
  Serial.begin(19200); 
  gprsSS.begin(19200);
  ss.begin(38400);
  ss.print("$PUBX,41,1,0007,0003,4800,0*13\r\n"); // Change iTead baudrate
  ss.flush();  delay(50);    ss.begin(19200); // reset SoftwareSerial baudrate  
  ss.flush();  delay(50);
}

void loop()
{
     ss.listen();
   if(OnOff == true) { //if GPRS shield is turned on, send http request, if not do nothing
     Serial.println();
     smartDelay(1000);
     gps.encode(ss.read());
     if (gps.location.isValid()) 
     SubmitHttpRequest(gps.location.lat(), gps.location.lng());
     Serial.println(" ");
   }
}


// This custom version of delay() ensures that the gps object
// is being "fed".
static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do 
  {
    while (ss.available())
      gps.encode(ss.read());
  } while (millis() - start < ms);
}

void SubmitHttpRequest(double lat, double lng)
{
  //float to string conversion
  char charVallat[10];
  char charVallng[9];
  String slat = "";
  String slng = "";

  String temp = "";
  
    
  dtostrf(lat, 4, 6, charVallat);
  dtostrf(lng, 4, 6, charVallng);

    //convert chararray to string
  for(int i=0;i<sizeof(charVallat)-1;i++)
  {
    slat+=charVallat[i];
  }
  for(int i=0;i<sizeof(charVallng);i++)
  {
    slng+=charVallng[i];
  }
    //input coordinates to url
  String URL = "http://sarkyb.stud.if.ktu.lt/semestrinis/receiver.php?lat=";
  URL += slat;
  URL += "&long=";
  URL += slng;

 gprsSS.listen(); //listening for gprs serial
  
 gprsSS.println("AT+CSQ");
 delay(50);
 gprsSS.println("AT+CGATT?");
 delay(50);
 gprsSS.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"");//setting the SAPBR, the connection type is using gprs
 delay(500);
 gprsSS.println("AT+SAPBR=3,1,\"APN\",\"gprs.startas.lt\"");//setting the APN, the second need you fill in your local apn server
 delay(1000);
 gprsSS.println("AT+SAPBR=1,1");//setting the SAPBR, for detail you can refer to the AT command mamual
 delay(1000);
 gprsSS.println("AT+HTTPINIT"); //init the HTTP request
 delay(1000); 
 gprsSS.println("AT+HTTPPARA=\"URL\",\"" + URL + "\"");// setting the httppara, the second parameter is the website you want to access
 Serial.print(URL);
 delay(500);
 gprsSS.println("AT+HTTPACTION=0");//submit the request 
 delay(2000);//the delay is very important, the delay time is base on the return from the website, if the return datas are very large, the time required longer. NOT RECOMMENDED TO MAKE THIS DELAY SMALLER
 while( gprsSS.read() != -1 ); //flushing gprsSS serial "INCOMING" data
 gprsSS.flush(); //flushing gprsSS serial "OUTGOING" data
 gprsSS.println("AT+HTTPREAD");// read the data from the website you access
 delay(1000);
 gprsSS.println("");
 ShowSerialData(); //Use data obtained from HTTPREAD 
 gprsSS.println("");
 delay(50);
 while( gprsSS.read() != -1 ); //flushing gprsSS serial "INCOMING" data
 gprsSS.flush(); //flushing gprsSS serial "OUTGOING" data
}
void ShowSerialData()
{
   int inChar[300]; // Char array for serial data (estimated up to 300 chars needed)
   int i=0;
   String data = "";
    while(gprsSS.available()!=0) {
      inChar[i] = gprsSS.read(); // reading data from serial to array
     // Serial.print(inChar[i]);
      i++; 
    }
    
   // Serial.print("\n");
    for(int j=0; j<i; j++)
    {
      data = String(inChar[j]) + String(inChar[j+1]) + String(inChar[j+2]) + String(inChar[j+3]) + String(inChar[j+4]); //making the all possible command versions. All commands are sent in 5 chars length
      
      //"8365866968" == "SAVED" in dec
      //"6777684849" == "CMD01" in dec -> "AT+CPOWD=1" -> GPRS shut down
      //IF found "CMD01" in decimal code, the GPRS shield is turned off
      if(data == "6777684849") {
        gprsSS.println("AT+CPOWD=1"); // turning off GPRS shield 
        OnOff = false; // turning off http requests for GPRS shield
      }
      // INPUT OTHER COMMANDS HERE ----------------------------------------------------------
    } 
}
