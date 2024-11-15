
const c = new AudioContext();
//sus is a boolean if true => sin, else => noise
function createsABuffer(sus,f) {
        return function() {
        const b = c.createBuffer(1, c.sampleRate * 2, 
        c.sampleRate);
        alpha = Math.PI*2*f/c.sampleRate;
        const audioData = b.getChannelData(0);
        if(!sus){
             for(var i=0; i<audioData.length; i++) {
                audioData[i] = Math.random();   
            }
            return b;
        }else{
        for(var i=0; i<audioData.length; i++) {
            audioData[i] = Math.sin(alpha*i);   
        }
        return b;
        }
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
