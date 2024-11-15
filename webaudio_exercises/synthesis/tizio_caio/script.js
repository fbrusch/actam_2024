let audioContext;
try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    console.error('Web Audio API is not supported in this browser');
}

let oscillator = null;
let oscillatorGain = null;

let bufferSource = null;
let bufferGain = null;


function createSoundBuffer() {
    const bufferSize = audioContext.sampleRate * 1; // 1 second buffer
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate a simple sine wave
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.sin(2 * Math.PI * 440 * i / audioContext.sampleRate);
    }
    
    return buffer;
}

// Oscillator Controls
document.getElementById('startOsc').addEventListener('click', () => {
    if (oscillator === null) {
       
        oscillator = audioContext.createOscillator();
        oscillatorGain = audioContext.createGain();
        
        oscillator.frequency.value = document.getElementById('freqControl').value;
        oscillator.type = document.getElementById('waveformControl').value;
        oscillatorGain.gain.value = 0.5;
        
        oscillator.connect(oscillatorGain);
        oscillatorGain.connect(audioContext.destination);
        oscillator.start();
    }
});

document.getElementById('stopOsc').addEventListener('click', () => {
    if (oscillator !== null) {
        oscillator.stop();
        oscillator = null;
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

// Buffer Controls
document.getElementById('startBuffer').addEventListener('click', () => {
    if (bufferSource === null) {
        // Create nodes
        bufferSource = audioContext.createBufferSource();
        bufferGain = audioContext.createGain();
        
        // Set buffer
        bufferSource.buffer = createSoundBuffer();
        bufferSource.loop = true;
        bufferSource.playbackRate.value = document.getElementById('rateControl').value;
        bufferGain.gain.value = 0.5;
        
        // Connect nodes
        bufferSource.connect(bufferGain);
        bufferGain.connect(audioContext.destination);
        
        // Start buffer
        bufferSource.start();
    }
});

document.getElementById('stopBuffer').addEventListener('click', () => {
    if (bufferSource !== null) {
        bufferSource.stop();
        bufferSource = null;
    }
});

document.getElementById('rateControl').addEventListener('input', (e) => {
    const rate = e.target.value;
    document.getElementById('rateDisplay').textContent = `${rate}x`;
    if (bufferSource) {
        bufferSource.playbackRate.value = rate;
    }
});