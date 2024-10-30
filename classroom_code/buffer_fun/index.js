
const c = new AudioContext();

function createsANoiseBuffer() {
    const b = c.createBuffer(1, c.sampleRate * 2, 
    c.sampleRate);

    const audioData = b.getChannelData(0);

    for(var i=0; i<audioData.length; i++) {
        audioData[i] = Math.random();   
    }
    return b;
}

function createsASineBuffer() {
    const b = c.createBuffer(1, c.sampleRate * 2, 
    c.sampleRate);

    const audioData = b.getChannelData(0);

    for(var i=0; i<audioData.length; i++) {
        audioData[i] = Math.sin(i/10);   
    }
    return b;
}



function playBuffer(bufferCreator) {

    b = bufferCreator();
 
    const bs = c.createBufferSource();
    bs.buffer = b;
    bs.connect(c.destination);
    bs.start();

}

function stop() {
    c.suspend();
}
