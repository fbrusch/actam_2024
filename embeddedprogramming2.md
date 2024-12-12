---
marp: true
theme: default
paginate: true
---

# ACTAM - Embedded programming with Advanced tools
## 12/12/2024

---

## Goals: Introduce two new tools

1) Arduino
2) SuperCollider

---

## What is Arduino?
* An open-source electronics platform combining hardware and software
* Perfect for interactive music and sound projects
* Check these out https://www.arduino.cc/education/arduino-instruments/

--

## Available Boards
https://www.arduino.cc/en/hardware 
* **Arduino Uno**: Basic board, good for simple audio projects
* **Arduino Due**: 
  - 12-bit DAC (Digital to Analog Converter)
  - Higher processing power (84 MHz)
  - Ideal for complex audio synthesis
* **Arduino Mega**: More I/O pins for multiple controllers/sensors

--

## How can I program it?

Get started with [this IDE](https://docs.arduino.cc/software/ide-v2/tutorials/getting-started-ide-v2/)
* Built-in examples and library manager
* Key audio libraries:
  - `Tone`: Basic frequency generation (e.g. Pulse Width Modulation)
  - `Mozzi`: Advanced audio synthesis (e.g. Algorithmic music)
  - [Arduino Audio Tools](https://github.com/pschatzmann/arduino-audio-tools) for multiple effects and audio formats

* A good way to start: https://www.tomshardware.com/how-to/use-arduino-ide-2

-- 

## Basic tone generation

```cpp
const int speakerPin = 9;
void setup() {
  pinMode(speakerPin, OUTPUT);
}

void loop() {
  tone(speakerPin, 440, 500);
  delay(1000);
}
```

## Mozzi Library Example
Advanced synthesis using the Mozzi library:

--

## Arduino as MIDI Controller
```cpp
void setup() {
  Serial.begin(9600);
}
void loop() {
  int sensorValue = analogRead(A0);
  // Map sensor to MIDI values (0-127)
  byte midiValue = map(sensorValue, 0, 1023, 0, 127);
  Serial.write(midiValue);
  delay(10);
}
```
--

## Arduino with Web Audio API
```javascript
// Receiving Arduino data via Web Serial API
async function connectArduino() {
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });

  const reader = port.readable.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (value) {
      oscillator.frequency.value = value * 10;
    }
  }
}
```
-- 

## What's SuperCollider? Isn't SonicPi enough?

* lower level language (SCLang)
* real-time audio server (spectral analysis, manipulation, and resynthesis with FFT)
* can define your own synthesis algorithms

-- 

## Basic SuperCollider Syntax

```supercollider
(
SynthDef(\simpleSine, {
    arg freq = 440;
    var sig = SinOsc.ar(freq, 0, 0.5);
    Out.ar(0, sig); //  precise channel mapping
}).add;
)

// Play the synth
x = Synth(\simpleSine);
x.set(\freq, 880);
x.free; // Stop
```

-- 

## SuperCollider getting Arduino Data

```supercollider
SerialPort.listDevices; // List available ports

p = SerialPort.new("/dev/ttyACM0", 9600);

// Read incoming data
r = Routine({
    var byte;
    loop {
        byte = p.read;
        // Map byte to frequency (example)
        {SinOsc.ar(byte * 10)}.play;
        0.01.wait;
    }
}).play;
```

## Arduino Code for SuperCollider
Same as for web audio api 

```cpp
const int sensorPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(sensorPin);
  Serial.write(map(sensorValue, 0, 1023, 0, 255));
  delay(10);
}
```

--

## Project Ideas & Applications

* Interactive sound installations
* Gesture-controlled synthesizers
* Real-time audio effects processors
* Sensor-based music generators
* Interactive performance tools
