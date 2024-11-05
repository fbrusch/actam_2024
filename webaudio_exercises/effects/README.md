# Instructions 

Create a simple web interface where you can manipulate one or more audio effects over one input signal.
Make a new directory with your name like in the example folder my_name.

## Goals

- Leverage oscillator and buffer functionalities of web audio api to generate an effect
- Explore different types of input 
- Implement simple but responsive audio effect controls 

- Bonus goal: Experiment with more than one node type (StereoPannerNode,DelayNode ConvolverNode, GainNode etc)


## Tips

- same as for audio synthesis exercise
- for a reverb effect, fill a buffer with randomized values that decay over time and then set it to the convolver node buffer
- use event listeners to update the effect values like `.addEventListener('input', () => {...}`