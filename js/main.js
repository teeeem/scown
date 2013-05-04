var gui = require('nw.gui');
var osc = require('node-osc');
var menu = new gui.Menu();

var client = new osc.Client('127.0.0.1', 12346);

var oscServer = new osc.Server(12346, '0.0.0.0');
oscServer.on("/drop", function (msg, rinfo) {
      var element = document.createElement('div');
      element.appendChild(document.createTextNode(msg[0] + ', ' + msg[1]));
      document.body.appendChild(element);
});
oscServer.on("/test/0", function (msg, rinfo) {
    console.log(msg);
});
oscServer.on("/test/1", function (msg, rinfo) {
    console.log(msg);
});

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var serial0 = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("/n")
});

var serial1 = new SerialPort("/dev/ttyUSB1", {
  baudrate: 9600,
  parser: serialport.parsers.readline("/n")
});

serial0.on("open", function () {
  console.log('open');
  serial0.on('data', function(data) {
    console.log('data received: ' + data);
  });  
  serial0.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });  
});

serial1.on("open", function () {
  console.log('open');
  serial1.on('data', function(data) {
    console.log('data received: ' + data);
  });  
  serial1.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });  
}); 

menu.append(new gui.MenuItem({
  label: 'Click Me',
  click: function() {
    var element = document.createElement('div');
    element.appendChild(document.createTextNode('Clicked OK'));
    document.body.appendChild(element);
    client.send('/drop', 200);
  }
}));

var handleClickA = function (event) {
  client.send('/drop', 100);
};

var handleClickB = function (event) {
  client.send('/drop', 200);
};

var handleClickC = function (event) {
  serial0.write("Sending from 0");
};

var handleClickD = function (event) {
  serial1.write("Sending from 1");
};

var buttonA = document.getElementById('a');
var buttonB = document.getElementById('b');
var buttonC = document.getElementById('c');
var buttonD = document.getElementById('d');
buttonA.addEventListener('click', handleClickA);
buttonB.addEventListener('click', handleClickB);
buttonC.addEventListener('click', handleClickC);
buttonD.addEventListener('click', handleClickD);

$(function() {
  $( '#master' ).slider({
    value: 60,
    orientation: "horizontal",
    range: "min",
    animate: true
  });
  $( "#sliders > span").each(function(index) {
    var value = parseInt( $( this ).text(), 10);
    $( this ).empty().slider({
      value: value,
      orientation: "vertical",
      range: "min",
      animate: true,
      slide: function( event, ui ) {
        //console.log(index);
        client.send('/test/'+index, ui.value);
      }
    });
  });
});
