var audioContext = new AudioContext();

playsound = function () {
  if (audioContext.state != 'running') {
    audioContext.resume();
  }
  var osc = audioContext.createOscillator();
  osc.type = document.getElementById('opzione1').value;
  var g = audioContext.createGain();

  osc.connect(g);
  osc.frequency.value = (parseInt(document.getElementById('frequency').value));
  g.gain.setValueAtTime(0, audioContext.currentTime);
  g.gain.linearRampToValueAtTime(1, audioContext.currentTime + attack);
  g.gain.linearRampToValueAtTime(0, audioContext.currentTime + attack + release);


  //---------ANALIZER CODE---------------
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  // Connect the source to be analyzed
  g.connect(analyser);
  g.connect(audioContext.destination);
  canvas = document.getElementById("oscilloscopio");
  canvasCtx = canvas.getContext("2d");


  osc.start();

}

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "rgb(200 200 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0 0 0)";

  canvasCtx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}
window.addEventListener('load', function () {
  this.document.getElementById('bottone').addEventListener('click', playsound)
})
var attack = 20;
var release = 200;

function n2f(n) {
  return 440 * Math.pow(2, n / 12);
}

