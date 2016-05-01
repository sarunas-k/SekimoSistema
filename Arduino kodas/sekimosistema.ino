#include <TinyGPS++.h>
#include <SoftwareSerial.h>
/*
   This sample code demonstrates the normal use of a TinyGPS++ (TinyGPSPlus) object.
   It requires the use of SoftwareSerial, and assumes that you have a
   4800-baud serial GPS device hooked up on pins 4(rx) and 3(tx).
*/
static const int RXPin = 10, TXPin = 11;
static const int GPSBaud = 9600;

SoftwareSerial gprsSS(7, 8);

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

void setup()
{
  Serial.begin(9600);
  gprsSS.begin(9600);
  ss.begin(38400);
  ss.print("$PUBX,41,1,0007,0003,4800,0*13\r\n"); // Change iTead baudrate
  ss.flush();  delay(50);    ss.begin(9600); // reset SoftwareSerial baudrate  
  ss.flush();  delay(50);
}

void loop()
{
  //printFloat(gps.location.lat(), gps.location.isValid(), 11, 6);
  //printFloat(gps.location.lng(), gps.location.isValid(), 12, 6);

  Serial.println();
  
  smartDelay(1000);

  if (gps.location.isValid()) {
    SubmitHttpRequest(gps.location.lat(),gps.location.lng());
    Serial.print("Issiusta: ");
    Serial.println(gps.location.lat());
    Serial.println(gps.location.lng());
  }

  if (Serial.available())
   switch(Serial.read())
  {
    case 'h':
      SubmitHttpRequest(40.687157,22.279652);
      break;
  } 
 if (gprsSS.available())
   Serial.write(gprsSS.read());
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

static void printFloat(float val, bool valid, int len, int prec)
{
  if (!valid)
  {
    while (len-- > 1)
      Serial.print('*');
    Serial.print(' ');
  }
  else
  {
    Serial.print(val, prec);
    int vi = abs((int)val);
    int flen = prec + (val < 0.0 ? 2 : 1); // . and -
    flen += vi >= 1000 ? 4 : vi >= 100 ? 3 : vi >= 10 ? 2 : 1;
    for (int i=flen; i<len; ++i)
      Serial.print(' ');
  }
  smartDelay(0);
}

void SubmitHttpRequest(double lat, double lng)
{
  String URL = "http://sarkyb.stud.if.ktu.lt/semestrinis/receiver.php?lat=";
  URL += (double)lat;
  URL += "&long=";
  URL += (double)lng;
 gprsSS.println("AT+CSQ");
 delay(50);
 ShowSerialData();// this code is to show the data from gprs shield, in order to easily see the process of how the gprs shield submit a http request, and the following is for this purpose too.
 gprsSS.println("AT+CGATT?");
 delay(50);
 ShowSerialData();
 gprsSS.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"");//setting the SAPBR, the connection type is using gprs
 delay(500);
 ShowSerialData();
 gprsSS.println("AT+SAPBR=3,1,\"APN\",\"gprs.startas.lt\"");//setting the APN, the second need you fill in your local apn server
 delay(1000);
 ShowSerialData();
 gprsSS.println("AT+SAPBR=1,1");//setting the SAPBR, for detail you can refer to the AT command mamual
 delay(1000);
 ShowSerialData();
 gprsSS.println("AT+HTTPINIT"); //init the HTTP request
 delay(1000); 
 ShowSerialData();
 gprsSS.println("AT+HTTPPARA=\"URL\",\"" + URL + "\"");// setting the httppara, the second parameter is the website you want to access
 delay(500);
 ShowSerialData();
 gprsSS.println("AT+HTTPACTION=0");//submit the request 
 delay(3000);//the delay is very important, the delay time is base on the return from the website, if the return datas are very large, the time required longer.
 ShowSerialData();
 gprsSS.println("AT+HTTPREAD");// read the data from the website you access
 delay(150);
 ShowSerialData();
 gprsSS.println("");
 delay(50);
}
void ShowSerialData()
{
 while(gprsSS.available()!=0)
   Serial.write(gprsSS.read());
}

