
//the web audio api only allow sounds with user gesture (no autoplay when the page loads) 
// the user must interact with the page


// 0 -
buttonEl = document.querySelector('button');

// 1 - create our context 
let audioContext = new AudioContext();

// 2 - 
function xray() {

    // 4 - create an oscillator node (many ways to create an input node)
    let osc = audioContext.createOscillator() 

    // 7 - set type of wave
    osc.type = 'triangle';

    // 8 - set frequency 
    osc.frequency.value = 140;

    // up fq over a second
    //osc.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 1)

    // 9 - create a gain node
    let gain = audioContext.createGain();
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.9)
    
    // 5 - start and stop oscillator
    osc.start();
    osc.stop(audioContext.currentTime + 2) // the time in secs since the context was instantiated
    // 6 - connect the audio graph (the input nodes to the output nodes)
    //osc.connect(audioContext.destination); // the dafault is the speaker

    // 10 - chain on nodes with connect method
    osc.connect(gain).connect(audioContext.destination);

}

// 3 - 
buttonEl.addEventListener('click', function() {

    // if the audio context is not running, resume it by clicking the button
    if (audioContext.state !== 'running') {
        audioContext.resume();
    }

    xray();
});

