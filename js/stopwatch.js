
var Stopwatch = function(elem, options) {

  var timer       = createTimer(),
      startButton = createButton("start", start),
      stopButton  = createButton("stop", stop),
      resetButton = createButton("reset", reset),
      offset,
      clock,
      interval;
  var alarms=[];

  // default options
  options = options || {};
  options.delay = options.delay || 10;
  if (options.showbuttons){
    if (options.showbuttons==true){

      elem.appendChild(startButton);
      elem.appendChild(stopButton);
      elem.appendChild(resetButton);

    }
  }
  // append elements
  elem.appendChild(timer);

  // initialize
  reset();

  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  function createButton(action, handler) {
    var a = document.createElement("a");
    a.href = "#" + action;
    a.innerHTML = action;
    a.addEventListener("click", function(event) {
      handler();
      event.preventDefault();
    });
    return a;
  }

  function start() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    render();
  }
  function set_alarm (time, func){
    alarms.push({time:time, func:func});
  }
  function get_clock (){
    return clock;
  }
  function update() {
    clock += delta();
    for (var i = (alarms.length-1); i >=0; i--){
      if (alarms[i].time < clock){
        alarms[i].func();
        alarms.splice(i);
      }
    }
    render();
  }
  function pad(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }
  function render() {
    //      timer.innerHTML = clock/1000;
    var min = Math.trunc(clock/60000);
    var sec = Math.trunc((clock-min*60000)/1000);
    var dec = Math.trunc((clock-min*60000-sec*1000)/10);
    timer.innerHTML = pad(min) + ":"+pad(sec)+":"+pad(dec)
    //timer.innerHTML = clock/1000;
  }

  function delta() {
    var now = Date.now(),
        d   = now - offset;

    offset = now;
    return d;
  }

  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
  this.set_alarm  = set_alarm;
  this.get_clock  = get_clock;
};

