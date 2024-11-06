// Initialize Audio Context
let audioContext;
try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    console.error('Web Audio API is not supported in this browser');
}

// Oscillator variables
let oscillator = null;
let oscillatorGain = null;
let analyser = null;

// Canvas variables
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Initialize analyzer
function setupAnalyser() {
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85;
    return analyser;
}

// Drawing function
function draw() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength)
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / bufferLength * 2.5;

    canvasCtx.fillStyle = '#f0f0f0';
    canvasCtx.fillRect(0, 0, width, height);

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        
        // Create gradient
        const gradient = canvasCtx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#2196F3');
        gradient.addColorStop(1, '#64B5F6');
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }

    requestAnimationFrame(draw);
}

// Oscillator Controls
document.getElementById('startOsc').addEventListener('click', () => {
    if (oscillator === null) {
        // Create nodes
        oscillator = audioContext.createOscillator();
        oscillatorGain = audioContext.createGain();
        const analyser = setupAnalyser();
        
        // Set initial values
        oscillator.frequency.value = document.getElementById('freqControl').value;
        oscillator.type = document.getElementById('waveformControl').value;
        oscillatorGain.gain.value = 0.5;
        
        // Connect nodes
        oscillator.connect(oscillatorGain);
        oscillatorGain.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // Start oscillator and visualization
        oscillator.start();
        draw();
    }
});

document.getElementById('stopOsc').addEventListener('click', () => {
    if (oscillator !== null) {
        oscillator.stop();
        oscillator = null;
        analyser = null;
    }
});

document.getElementById('freqControl').addEventListener('input', (e) => {
    const freq = e.target.value;
    document.getElementById('freqDisplay').textContent = `${freq} Hz`;
    if (oscillator) {
        oscillator.frequency.value = freq;
    }
});

document.getElementById('waveformControl').addEventListener('change', (e) => {
    if (oscillator) {
        oscillator.type = e.target.value;
    }
});