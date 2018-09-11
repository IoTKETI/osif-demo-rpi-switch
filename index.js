var GPIO = require('onoff').Gpio;
const ketiCiotClient = require('./lib/keti.ciot.client.js');

var ledPin = 18;    //  BCM 18, wPi 1, Phy 12
var buttonPin = 17; //  BCM 17, wPi 0, Phy 11


var led1PinBCM    = 17;    //  Phy 11, wPi 0, BCM 17
var led2PinBCM    = 27;    //  Phy 13, wPi 2, BCM 27
var buttonPinBCM  = 22;    //  Phy 15, wPi 3, BCM 22


var led1 = new GPIO(led1PinBCM, 'out');
var led2 = new GPIO(led2PinBCM, 'out');
var button = new GPIO(buttonPinBCM, 'in', 'both');

function light(err, state) {

  switch(state) {
    case  0:
      led1.writeSync(0);
      led2.writeSync(0);
      break;

    case  1:
      led1.writeSync(0);
      led2.writeSync(1);
      break;

    case  2:
      led1.writeSync(1);
      led2.writeSync(0);
      break;

    case  3:
      led1.writeSync(1);
      led2.writeSync(1);
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

console.log('start');
button.watch(light);



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
