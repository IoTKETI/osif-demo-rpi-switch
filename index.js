var GPIO = require('onoff').Gpio;
var OSIFClient = require('osif-client');

var ledRPinBCM    = 18;    //  Phy 12, wPi 1, BCM 18
var ledGPinBCM    = 17;    //  Phy 11, wPi 0, BCM 17
var ledBPinBCM    = 27;    //  Phy 13, wPi 2, BCM 27
var buttonPinBCM  = 22;    //  Phy 15, wPi 3, BCM 22


var ledR = new GPIO(ledRPinBCM, 'out');
var ledG = new GPIO(ledGPinBCM, 'out');
var ledB = new GPIO(ledBPinBCM, 'out');
var button = new GPIO(buttonPinBCM, 'in', 'both');


var LED_OFF = 0;
var LED_ON = 2;


function controlLED(ledState) {

  console.log( "controlLED: ", ledState)

  switch(ledState) {
    case  0:
      ledR.writeSync(1);
      ledG.writeSync(1);
      ledB.writeSync(1);
      break;

    case  1:
      ledR.writeSync(0);
      ledG.writeSync(1);
      ledB.writeSync(1);
      break;

    case  2:
      ledR.writeSync(1);
      ledG.writeSync(0);
      ledB.writeSync(1);
      break;

    case  3:
      ledR.writeSync(1);
      ledG.writeSync(1);
      ledB.writeSync(0);
      break;
  }
}


var serviceOptions = require('./ciotservice.json');
var client1 = new OSIFClient(serviceOptions);


var ledState = LED_OFF;

var g_SensorControlState = false;

function onButtonPushed(err, state) {
  if(state === 0) {

    g_SensorControlState = !g_SensorControlState;

    console.log('BUTTON PUSHED : SET GLOBAL APP DATA: iotweek-led-state : ', g_SensorControlState);
    client1.setGlobalAppData("iotweek-sensor-control", g_SensorControlState);

    controlLED(g_SensorControlState ? LED_ON : LED_OFF);

  }
  else {
    return;
  }
}


function serviceStart() {

  client1.init()
    .then(function(client){
      client.startService()
        .then(function(value) {
          console.log('startService', value);


          return client1.getGlobalAppData("iotweek-sensor-control");
        })

        .then(function(controlValue){
          g_SensorControlState = controlValue;


          //  LED Off
          controlLED(g_SensorControlState ? LED_ON : LED_OFF);

          //  Start watch changing state of button.
          button.watch(onButtonPushed);
        });
    });


  console.log('Service start...');
}


function serviceShutdown() {


  client1.stopService()
    .then((result)=>{

      process.exit(0);
    });

}

process.on('SIGINT', function () {
    serviceShutdown();
});
process.on('SIGTERM', function () {
    serviceShutdown();
});




//
serviceStart();