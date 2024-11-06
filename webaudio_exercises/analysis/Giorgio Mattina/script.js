var audioContext = new AudioContext();

playsound = function() {
    if(audioContext.state !='running'){
        audioContext.resume();
    }
    var osc = audioContext.createOscillator();
    osc.type=document.getElementById('opzione1').value;
    var g = audioContext.createGain();

    osc.connect(g);
    g.connect(audioContext.destination);
    osc.frequency.value=(parseInt(document.getElementById('frequency').value));
    g.gain.setValueAtTime(0,audioContext.currentTime);
    g.gain.linearRampToValueAtTime(1,audioContext.currentTime+attack);
    g.gain.linearRampToValueAtTime(0,audioContext.currentTime+attack+release);
    
    osc.start();

}
window.addEventListener('load',function(){
    this.document.getElementById('bottone').addEventListener('click',playsound)
})
var attack = 20;
var release = 200;

function n2f(n){
    return 440*Math.pow(2,n/12);
}
    
