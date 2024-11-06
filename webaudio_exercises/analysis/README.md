# Instructions 

Build a simple visualizer that displays the frequency spectrum of an audio input. 
Too difficult? Stick to the time domain and display only the waveform, check here [an example](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createAnalyser)

Make a new directory with your name like in the example folder my_name.

## Goals
- Getting familiar with the createAnalyser() two main possibilities (extracting time and frequency domain data)
- Set a main drawing function and practice with canvas variables (e.g resizing, filling, gradients) to design your visualizer

- Bonus goal: Display more than one input waveform 

## Tips
- use the html element `<canvas id="yourvisualizer"></canvas>`
- use the method `requestAnimationFrame(draw)` for smooth animations
