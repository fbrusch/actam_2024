const c = new AudioContext();

function returnBufferData() {
    const b = c.createBuffer(1, c.sampleRate * 2,
        c.sampleRate);
    const audioData = b.getChannelData(0);
    return b, audioData
}

function createsANoiseBuffer() {
    const b, audioData = returnBufferData();

    for (var i = 0; i < audioData.length; i++) {
        audioData[i] = Math.random();
    }
    return b;
}

function createsASineBuffer(f) {
    return function () {
        const b, audioData = returnBufferData();

        alpha = Math.PI * 2 * f / c.sampleRate;
        for (var i = 0; i < audioData.length; i++) {
            audioData[i] = Math.sin(alpha * i);
        }
        return b;
    }
}

function playBuffer(bufferCreator) {

    b = bufferCreator();

    const bs = c.createBufferSource();
    bs.buffer = b;
    bs.connect(c.destination);
    bs.start();

}

function stopSound() {
    c.suspend();
}