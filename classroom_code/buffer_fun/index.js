const c = new AudioContext();

function createBuffer(f, waveFunc) {
    return function() {
        const b = c.createBuffer(1, c.sampleRate * 2, 
        c.sampleRate);
        const audioData = b.getChannelData(0);
        for(var i=0; i<audioData.length; i++) {
            audioData[i] = waveFunc(f, i);  
        };
        return b; 
    }
}

function countSine(f, i) {
    alpha = Math.PI*2*f/c.sampleRate;
    return Math.sin(alpha * i)    
}

function countNoize() {
    return Math.random();
}

function playBuffer(bufferCreator) {

    const b = bufferCreator();
    const bs = c.createBufferSource();
    bs.buffer = b;
    bs.connect(c.destination);
    bs.start();

}

function stop() {
    c.suspend();
}