const c = new AudioContext();
var freq = 0;

function createBuffer(type, f = 440) {
    return function () {

        const b = c.createBuffer(1, c.sampleRate * 2,
            c.sampleRate);
        const audioData = b.getChannelData(0);

        if (type == 'noise') {
            for (var i = 0; i < audioData.length; i++) {
                audioData[i] = Math.random();
            }
        }

        else if (type == 'sine') {
            alpha = Math.PI * 2 * f / c.sampleRate;
            for (var i = 0; i < audioData.length; i++) {
                audioData[i] = Math.sin(alpha * i);
            }

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

function stop() {
    c.suspend();
}