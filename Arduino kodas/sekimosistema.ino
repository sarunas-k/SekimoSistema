#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <String.h>

/*
   This sample code demonstrates the normal use of a TinyGPS++ (TinyGPSPlus) object.
   It requires the use of SoftwareSerial, and assumes that you have a
   4800-baud serial GPS device hooked up on pins 4(rx) and 3(tx).
*/
static const int RXPin = 10, TXPin = 11;
static const int GPSBaud = 19200;

SoftwareSerial gprsSS(7, 8);

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
 /* if (gps.location.isValid()) {
    Serial.print(gps.location.lat());
    Serial.print(gps.location.lng());
  }*/
       
   String inputString = "";
   Serial.println();
   smartDelay(1000);
   if (gps.location.isValid()) 
   SubmitHttpRequest(gps.location.lat(), gps.location.lng());
   
   
/*
 Serial.print(inputString);
    Serial.print("Issiusta: ");
    Serial.println(gps.location.lat());
    Serial.println(gps.location.lng());
  }

/*  if (Serial.available())
   switch(Serial.read())
  {
    case 'h':
      SubmitHttpRequest(40.687157,22.279652);
      break;
  } */
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

/*static void printFloat(float val, bool valid, int len, int prec)
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
}*/


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
    
  String URL = "http://sarkyb.stud.if.ktu.lt/semestrinis/receiver.php?lat=";
  URL += slat;
  URL += "&long=";
  URL += slng;

 gprsSS.listen();
  
 gprsSS.println("AT+CSQ");
 delay(50);
 //ShowSerialData();// this code is to show the data from gprs shield, in order to easily see the process of how the gprs shield submit a http request, and the following is for this purpose too.
 gprsSS.println("AT+CGATT?");
 delay(50);
 //ShowSerialData();
 gprsSS.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"");//setting the SAPBR, the connection type is using gprs
 delay(500);
 //ShowSerialData();
 gprsSS.println("AT+SAPBR=3,1,\"APN\",\"gprs.startas.lt\"");//setting the APN, the second need you fill in your local apn server
 delay(1000);
 //ShowSerialData();
 gprsSS.println("AT+SAPBR=1,1");//setting the SAPBR, for detail you can refer to the AT command mamual
 delay(1000);
 //ShowSerialData();
 gprsSS.println("AT+HTTPINIT"); //init the HTTP request
 delay(1000); 
 //ShowSerialData();
 gprsSS.println("AT+HTTPPARA=\"URL\",\"" + URL + "\"");// setting the httppara, the second parameter is the website you want to access
 Serial.print(URL);
 delay(500);
 //ShowSerialData();
 
 gprsSS.println("AT+HTTPACTION=0");//submit the request 
 delay(2000);//the delay is very important, the delay time is base on the return from the website, if the return datas are very large, the time required longer.
 //ShowSerialData();
 while( gprsSS.read() != -1 );
 gprsSS.flush();
 gprsSS.println("AT+HTTPREAD");// read the data from the website you access
 delay(1000);
 gprsSS.println("");
 ShowSerialData();

 
 gprsSS.println("");
 delay(50);
 while( gprsSS.read() != -1 );
 gprsSS.flush();
}
void ShowSerialData()
{
   int inChar[300];
   int i=0;
   String data = "";
  /*  while(gprsSS.available()!=0) {
      inChar[i] = gprsSS.read();
      i++;
    }
    for(int j=0; j<i; j++)
    {
      Serial.print(inChar[j]);
    } */

    while(gprsSS.available()!=0) {
      inChar[i] = gprsSS.read();
     // Serial.print(inChar[i]);
      i++;
    }
    
   // Serial.print("\n");
    for(int j=0; j<i; j++)
    {
      //
      data = String(inChar[j]) + String(inChar[j+1]) + String(inChar[j+2]) + String(inChar[j+3]) + String(inChar[j+4]);

      //Jei ið http gaunama "SAVED" iðjungiamas GPRS shield
      if(data == "8365866968") //"8365866968" == "SAVED" in dec
      gprsSS.println("AT+CPOWD=1"); //Iðjungiamas GPRS
    } 
}
