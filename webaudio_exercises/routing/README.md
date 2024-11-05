# Instructions 

Create a simple app that routes audio from an oscillator through multiple gain nodes and changes the routing dynamically.
Make a new directory with your name like in the example folder my_name.


## Goals

- Experiment with directing the audio signal flow (understand the audio context destination)
- Control the audio graph with using a toggle routing interface
- Audio nodes are interchangeable in the routing chain, check with audio buffer as well.

- Bonus goal: Add visual feedback for active routing paths (e.g. connected/disconnected lines)

## Tips

- same as for audio synthesis exercise
- start with simple GainNodes (other effects and modulations later)
- remind that destination property of AudioContext defines where all processed audio is ultimately sent for playback
