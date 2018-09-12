var GPIO = require('onoff').Gpio;
var CiotDatabusClient = require('ciot-databus-client').Client;

var ledRPinBCM    = 18;    //  Phy 12, wPi 1, BCM 18
var ledGPinBCM    = 17;    //  Phy 11, wPi 0, BCM 17
var ledBPinBCM    = 27;    //  Phy 13, wPi 2, BCM 27
var buttonPinBCM  = 22;    //  Phy 15, wPi 3, BCM 22


var ledR = new GPIO(ledRPinBCM, 'out');
var ledG = new GPIO(ledGPinBCM, 'out');
var ledB = new GPIO(ledBPinBCM, 'out');
var button = new GPIO(buttonPinBCM, 'in', 'both');


var LED_OFF = 0;


var ledState = 0;

function onButtonPushed(err, state) {
  if(state === 0) {
    ledState = (ledState+1)%4;

    controlLED(ledState);
  }
  else {
    return;
  }
}

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


var listener = {
    'updated': function(arg1, arg2, arg3){
        console.log( arguments );

        ketiCiotClient.getValue(ketiCiotClient.KEYS.CIOT_DEMO_SWITCH, arg1)
            .then(function(value){
                if (value == 'on') {
                    led.writeSync(1);
                    console.log('light on');
                }
                else {
                    led.writeSync(0);
                    console.log('light off');
                }            })
            .catch(function(err){
                console.log( err );
            });

    }
}


ketiCiotClient.setEventListener(ketiCiotClient.KEYS.CIOT_DEMO_SWITCH, 'state', listener)
    .then(function(result){
        console.log( 'evnet listener result: ', result );
    })




ketiCiotClient.setValue(ketiCiotClient.KEYS.CIOT_PROCESS, 'demo-led', {state: 'run', instanceid: '383f327dd3'})
    .then(function(value){
        console.log( value );

    })
    .catch(function(err){
        console.log( err );
    });





var serviceOptions = require('./ciotservice.json');
var client1 = new CiotDatabusClient(options);






function serviceStart() {



  client1.init()
    .then(function(client){
      client.startService()
        .then(function(value){
          console.log( 'startService', value );


          //  LED Off
          controlLED(LED_OFF);

          //  Start watch changing state of button.
          button.watch(onButtonPushed);


        })

      ;
    });





  console.log('Service start...');
}


function serviceShutdown() {
    server.close(function () {
        ketiCiotClient.setValue(ketiCiotClient.KEYS.CIOT_PROCESS, 'demo-led', {state: 'stop', instanceid: '383f327dd3'})
            .then(function(value){
                console.log( value );
                process.exit(0);
            })
            .catch(function(err){
                console.log( err );
                process.exit(0);
            });
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