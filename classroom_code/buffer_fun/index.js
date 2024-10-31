const c = new AudioContext();
f = 440
b = c.createBuffer(1, c.sampleRate * 2,c.sampleRate);
audioData = b.getChannelData(0);

//buffer source
play = function () {
     bs = c.createBufferSource();
     bs.buffer = b;
     bs.connect(c.destination);
     bs.start();   
}

function createsANoiseBuffer() {
    for(var i=0; i<audioData.length; i++) {
        audioData[i] = Math.random();   
    }
    play()
}

function createsASineBuffer(f) {
        alpha = Math.PI*2*f/c.sampleRate;
        for(var i=0; i<audioData.length; i++) {
            audioData[i] = Math.sin(alpha*i);   
        }
        play()
}

function stop() {
    c.suspend();
}
