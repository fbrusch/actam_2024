
const c = new AudioContext();

function main() {

    const o = c.createOscillator();
    o.connect(c.destination);

    o.start();
}

function stop() {
    c.suspend();
}
