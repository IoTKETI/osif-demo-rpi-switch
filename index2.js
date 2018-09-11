var GPIO = require('onoff').Gpio;

//  Define constants
//  GPIO pin number
var CONST_PIN_LED     = 18;
var CONST_PIN_SWITCH  = 17;

//  GPIO configuration
var led     = new GPIO(CONST_PIN_LED, 'out');
var button  = new GPIO(CONST_PIN_SWITCH, 'in', 'both');

//  LED 상태 변경
function light(err, state) {

    //  입력 신호가 1인 경우 LED를 킨다
    if (state == 1) {
        led.writeSync(1);
        console.log('light on');
    }

    //  입력 신호가 1이 아닌 경우 LED를 끈다
    else {
        led.writeSync(0);
        console.log('light off');
    }
}


//  switch의 상태 변화를 모니터링한다  상태가 변경되면 callback 함수를 호출한다
button.watch(light);


