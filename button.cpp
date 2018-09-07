#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <wiringPi.h>
 
#define btnPin 3   //pin 16(GPIO 23)
#define ledPin 2
#define gndPin 0
 
int main(void)
{
    wiringPiSetup(); 
 
    pinMode(btnPin, INPUT);//버튼을 위해 입력으로 설정
    pinMode(ledPin, OUTPUT);
    pinMode(gndPin, OUTPUT);

    digitalWrite(gndPin, HIGH);
    digitalWrite(ledPin, HIGH);

    while(1)
    {
        int ret = digitalRead(btnPin);
	printf("%d\n", ret);
        if ( ret ) 
        {
            printf("unpressed\n"); 
            digitalWrite(ledPin, HIGH);
        }
        else 
        {
            printf("pressed\n"); 
            digitalWrite(ledPin, LOW);
        }
        delay(1000);
    }
    return 0;
}
