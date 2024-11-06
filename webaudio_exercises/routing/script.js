class AudioRouter {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
        this.routeThroughGain2 = true;
        
        this.setupAudioNodes();
        this.setupEventListeners();
        this.updateConnectionsDisplay();
    }

    setupAudioNodes() {
        this.oscillator = null;
        this.gainNode1 = this.audioContext.createGain();
        this.gainNode2 = this.audioContext.createGain();
        
        // Set initial gain values
        this.gainNode1.gain.value = 0.5;
        this.gainNode2.gain.value = 0.5;
    }

    createOscillator() {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.frequency.value = 300;
        this.oscillator.type = 'sine';
        this.updateRouting();
    }

    updateRouting() {
        if (!this.oscillator) return;

        // Disconnect all
        this.oscillator.disconnect();
        this.gainNode1.disconnect();
        this.gainNode2.disconnect();

        // Connect oscillator to first gain
        this.oscillator.connect(this.gainNode1);

        // Route based on toggle state
        if (this.routeThroughGain2) {
            this.gainNode1.connect(this.gainNode2);
            this.gainNode2.connect(this.audioContext.destination);
        } else {
            this.gainNode1.connect(this.audioContext.destination);
        }

        this.updateConnectionsDisplay();
    }

    toggleRouting() {
        this.routeThroughGain2 = !this.routeThroughGain2;
        this.updateRouting();
    }

    updateConnectionsDisplay() {
        const connections = document.getElementById('connections');
        connections.innerHTML = '';

        const createConnection = (start, end) => {
            const startRect = start.getBoundingClientRect();
            const endRect = end.getBoundingClientRect();
            const diagramRect = document.querySelector('.routing-diagram').getBoundingClientRect();

            const line = document.createElement('div');
            line.className = 'connection';

            const x1 = startRect.right - diagramRect.left;
            const y1 = startRect.top - diagramRect.top + startRect.height/2;
            const x2 = endRect.left - diagramRect.left;
            const y2 = endRect.top - diagramRect.top + endRect.height/2;

            const length = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
            const angle = Math.atan2(y2-y1, x2-x1) * 180/Math.PI;

            line.style.width = `${length}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}deg)`;

            connections.appendChild(line);
        }

        document.querySelectorAll('.node').forEach(node => node.classList.remove('active'));

        // Add active class to nodes in use
        document.getElementById('oscillatorNode').classList.add('active');
        document.getElementById('gain1Node').classList.add('active');
        if (this.routeThroughGain2) {
            document.getElementById('gain2Node').classList.add('active');
        }
        document.getElementById('destinationNode').classList.add('active');

        // Draw connections
        createConnection(
            document.getElementById('oscillatorNode'),
            document.getElementById('gain1Node')
        );

        if (this.routeThroughGain2) {
            createConnection(
                document.getElementById('gain1Node'),
                document.getElementById('gain2Node')
            );
            createConnection(
                document.getElementById('gain2Node'),
                document.getElementById('destinationNode')
            );
        } else {
            createConnection(
                document.getElementById('gain1Node'),
                document.getElementById('destinationNode')
            );
        }
    }

    setupEventListeners() {
        // Start/Stop button
        document.getElementById('startStop').addEventListener('click', () => {
            if (this.isPlaying) {
                this.oscillator.stop();
                this.oscillator = null;
                this.isPlaying = false;
            } else {
                this.createOscillator();
                this.oscillator.start();
                this.isPlaying = true;
            }
        });

        // Toggle routing button
        document.getElementById('toggleRouting').addEventListener('click', () => {
            this.toggleRouting();
        });

        // Frequency control
        document.getElementById('frequency').addEventListener('input', (e) => {
            if (this.oscillator) {
                const freq = parseInt(e.target.value);
                this.oscillator.frequency.value = freq;
                document.getElementById('frequencyValue').textContent = `${freq} Hz`;
            }
        });

        // Waveform control
        document.getElementById('waveform').addEventListener('change', (e) => {
            if (this.oscillator) {
                this.oscillator.type = e.target.value;
            }
        });
    }
}

// Initialize the audio router when the page loads
window.addEventListener('load', () => {
    const router = new AudioRouter();
});