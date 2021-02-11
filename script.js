const canvas = document.getElementById('visualizer');
const context = canvas.getContext('2d');

// Set Canvas to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight-300;

// Need Play Button, can't autostart audio, thems the rules
const playButton = document.getElementById('button-play')
playButton.addEventListener('click', () => {init()});

const pauseButton = document.getElementById('button-pause')
pauseButton.addEventListener('click',() => { audio.pause()});

// Define variables
let audio, analyzer, frequencyArray

function createAudio() {
  // Create new audio object
  audio = new Audio();
  audio.src = 'Mamman_Sani-Five_Hundred_Miles.mp3'
  audio.loop = true;
  audio.crossOrigin = 'anonymous';

  // Create audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 1024;

  const source = audioContext.createMediaElementSource(audio);
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);

  // Get an array of audio data from the analyser
	frequencyArray = new Uint8Array(analyzer.frequencyBinCount);
  // console.log(frequencyArray.length)
  audio.play();

}

let i,
    cx, cy,
    r = 50,
    beginAngle = 0,
    angle,
    twoPI = 2 * Math.PI;

function render() {
  window.requestAnimationFrame(render);

  centerX = canvas.width / 2;
  centerY = canvas.height / 2;

  context.save();
  analyzer.getByteFrequencyData(frequencyArray);

  // trials
  data = frequencyArray;
  angle = beginAngle;
  cx = canvas.width / 2;
  cy = canvas.height / 2;
  context.clearRect(0, 0, canvas.width, canvas.height);
  // context.strokeStyle = color;
  context.globalCompositeOperation = 'lighter';
  context.lineWidth = 5;
  total = 0;
  let len = analyzer.fftSize / 16;
  let colorStep = 360 / len;
  for (i = 8; i < len; i += 4) {
      angle += 5;
      context.beginPath();

      context.ellipse(cx, cy, len +data[i]/2, len+data[i], angle, beginAngle, twoPI+ data[i]);

      context.closePath();
      // set stroke color
		  context.strokeStyle = `hsla(${colorStep * i}, 100%, 40%, 0.5)`
      context.stroke();
      total += data[i];
  }
  beginAngle = (beginAngle + 0.00001 * total) % twoPI;
  context.restore();

}

function init() {
  createAudio();
  render();
}

window.addEventListener('load', init, false);
