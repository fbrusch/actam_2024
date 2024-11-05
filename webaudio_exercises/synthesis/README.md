# Instructions 

Create a simple web interface where you can generate and control audio streams.
Make a new directory with your name like in the example folder my_name.

## Goals

- Explore difference between generating sound in real-time (i.e. continous) and play pre-computed audio data (i.e. discrete)
- Explore different waveform types
- Implement simple but responsive audio controls 

- Bonus goal: Monitor performance (cpu usage and/or buffer usage of memory)

## Tips

- always initialize audio context especially after a user interaction
- always disconnect and nullify nodes when stopping sound
- keep controls grouped logically