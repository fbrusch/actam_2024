let audioContext;
let oscillator;
let convolverNode;
let dryGainNode;
let wetGainNode;

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const frequencyControl = document.getElementById('frequencyControl');
const frequencyValue = document.getElementById('frequencyValue');
const dryWetControl = document.getElementById('dryWetControl');
const dryWetValue = document.getElementById('dryWetValue');

startButton.addEventListener('click', initAudio);
stopButton.addEventListener('click', stopAudio);
frequencyControl.addEventListener('input', updateFrequency);
dryWetControl.addEventListener('input', updateDryWet);

// Create impulse response for reverb
// generates an artificial impulse response by filling a buffer with randomized values that decay over time
function createImpulseResponse(duration = 2, decay = 2.0) {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay); // random values that decay over time. Larger values of decay create a slower decay
        }
    }
    
    return impulse;
}

async function initAudio() {
    try {
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // my nodes
        oscillator = audioContext.createOscillator();
        convolverNode = audioContext.createConvolver();
        dryGainNode = audioContext.createGain();
        wetGainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        
        // set impulse response
        convolverNode.buffer = createImpulseResponse();
        
        const dryWet = parseFloat(dryWetControl.value);
        dryGainNode.gain.value = 1 - dryWet;
        wetGainNode.gain.value = dryWet;
        
        //  connect everything
        oscillator.connect(dryGainNode);
        oscillator.connect(convolverNode);
        convolverNode.connect(wetGainNode);
        dryGainNode.connect(audioContext.destination);
        wetGainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        // aggiorna ui
        startButton.disabled = true;
        stopButton.disabled = false;
        
    } catch (error) {
        console.error('Error initializing audio:', error);
        alert('Error initializing audio system');
    }
}

function stopAudio() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
    if (audioContext) {
        audioContext.close();
    }
    startButton.disabled = false;
    stopButton.disabled = true;
}

function updateFrequency(event) {
    const value = event.target.value;
    if (oscillator) {
        oscillator.frequency.setValueAtTime(value, audioContext.currentTime);
    }
    frequencyValue.textContent = `${value} Hz`;
}

function updateDryWet(event) {
    const value = event.target.value;
    if (dryGainNode && wetGainNode) {
        dryGainNode.gain.setValueAtTime(1 - value, audioContext.currentTime);
        wetGainNode.gain.setValueAtTime(value, audioContext.currentTime);
    }
    dryWetValue.textContent = value;
}