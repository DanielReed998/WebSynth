var audioContext = new AudioContext();
var osc;

function play() {
osc = audioContext.createOscillator();
osc.frequency.value = 440;
console.log(document.getElementById('#waveform'));
osc.type = document.getElementById('waveform').nodeValue;  
osc.connect(audioContext.destination);
                osc.start(0);
}

function stop() {
  osc.disconnect();
}

function setType(select) {
  if (osc) {
    osc.type = select.value;
  }
}

function toggle() {document.getElementsByTagName('button').toggle();
}
