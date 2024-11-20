
const c = new AudioContext();


function createABuffer() {
    return  c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
}

function createsANoiseBuffer() {

    const b = createABuffer();

    const audioData = b.getChannelData(0);

    for(var i=0; i<audioData.length; i++) {
        audioData[i] = Math.random();   
    }
    return b;
}

function createsASineBuffer(f) {
        return function() {

        const b = createABuffer();
        
        alpha = Math.PI*2*f/c.sampleRate;

        const audioData = b.getChannelData(0);

        for(var i=0; i<audioData.length; i++) {
            audioData[i] = Math.sin(alpha*i);   
        }
        return b;
    }
}



function playBuffer(bufferCreator) {

    b = bufferCreator();
 
    const bs = c.createBufferSource();
    bs.buffer = b;
    //bs.loop = true;
    bs.connect(c.destination);
    bs.start();

}

function stop() {
    c.suspend();
}
