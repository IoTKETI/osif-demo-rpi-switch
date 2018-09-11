var GPIO = require('onoff').Gpio;

//
//  'onoff' library use BCM pin number
//
var led1PinBCM    = 17;    //  Phy 11, wPi 0, BCM 17
var led2PinBCM    = 27;    //  Phy 13, wPi 2, BCM 27
var buttonPinBCM  = 22;    //  Phy 15, wPi 3, BCM 22


var led1 = new GPIO(led1PinBCM, 'out');
var led2 = new GPIO(led2PinBCM, 'out');
var button = new GPIO(buttonPinBCM, 'in', 'both');

var ledState = 0;

function light(err, state) {

    if(state === 1)
        ledState = (ledState+1)%4;

  switch(ledState) {
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



console.log('start');
button.watch(light);



process.on('SIGINT', function () {
    console.log( 'exit');
});
process.on('SIGTERM', function () {
  console.log( 'exit');
});
