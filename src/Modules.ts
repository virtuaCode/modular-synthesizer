import { Connection } from "./Connection";
import { Button, Knob, Select, Toggle } from "./UI";
import { Port, InputPort, CVOutputPort, AudioOutputPort, AudioInputPort, CVInputPort, GateOutputPort, GateInputPort } from "./Ports";
import { updateActiveModule } from "./main";
import { GateNode } from "./Nodes";



export interface Globals {
    draggedModule: Module | null;
    activeModule: Module | null;
    audioContext: AudioContext;
    dragOffset: { x: number, y: number };
    modules: Module[];
    connectingPort: Port | null;
    connections: Connection[];
}

export function updateConnectionPath(connection: Connection) {
    const sourceRect = connection.sourcePort.port.getBoundingClientRect();
    const targetRect = connection.targetPort.port.getBoundingClientRect();

    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    const controlPointOffset = Math.abs(endX - startX) / 2;
    connection.path.setAttribute('d',
        `M ${startX} ${startY} C ${startX + controlPointOffset} ${startY}, ${endX - controlPointOffset} ${endY}, ${endX} ${endY}`
    );
}

export abstract class Module {
    x: number;
    y: number;
    id: string;
    outputConnections: Connection[];
    ports: Port[];
    element: HTMLElement;
    inputConnections: Connection[]


    constructor(public readonly globals: Globals, type: string, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.id = 'module_' + Math.random().toString(36).substr(2, 9);
        this.inputConnections = [];
        this.outputConnections = [];
        this.ports = [];

        this.element = document.createElement('div');
        this.element.className = 'module';
        this.element.id = this.id;
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';

        this.element.addEventListener('mousedown', this.onClick.bind(this))

        let title = document.createElement('h3');
        title.textContent = type.toUpperCase()
        this.element.appendChild(title);
        this.element.addEventListener('mousedown', this.startDragging.bind(this));
        document.body.appendChild(this.element);
    }

    startDragging(e: MouseEvent) {
        this.globals.draggedModule = this;
        this.globals.activeModule = this;
        updateActiveModule()
        const rect = this.element.getBoundingClientRect();
        this.globals.dragOffset.x = e.clientX - rect.left;
        this.globals.dragOffset.y = e.clientY - rect.top;
    }

    updatePosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.updateConnections();
    }

    updateConnections() {
        // Update all connections related to this module
        this.outputConnections.forEach(updateConnectionPath);
        this.inputConnections.forEach(updateConnectionPath);
    }

    updateConnected() {
        this.outputConnections.forEach(conn => {
            conn.sourcePort.source.connect(conn.targetPort.target)
        });

        this.outputConnections.forEach(conn => {
            conn.targetPort.module.updateConnected();
        });
    }

    onClick(e: MouseEvent) {

    }

    abstract stop(): void
}


export class LFOModule extends Module {
    lfoNode: OscillatorNode
    scalingNode: GainNode
    adderNode: GainNode
    gainNode: GainNode
    offsetNode: ConstantSourceNode
    knob: Knob
    select: Select
    outputPort1: AudioOutputPort

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "lfo", x, y);
        this.lfoNode = globals.audioContext.createOscillator();
        this.lfoNode.start()

        // Create a GainNode to scale the signal by 0.5
        this.scalingNode = globals.audioContext.createGain();
        this.scalingNode.gain.value = 0.5;

        // Create a ConstantSourceNode to add an offset of 0.5
        this.offsetNode = globals.audioContext.createConstantSource();
        this.offsetNode.offset.value = 0.5;
        this.offsetNode.start()

        this.gainNode = globals.audioContext.createGain();

        // Connect the source to the gainNode, scaling it to [-0.5, 0.5]
        this.lfoNode.connect(this.scalingNode);
        
        // Connect the gainNode and offsetNode to the audioContext’s destination
        this.adderNode = globals.audioContext.createGain(); // Used to sum the signals
        this.scalingNode.connect(this.adderNode);
        this.offsetNode.connect(this.adderNode);
        this.adderNode.connect(this.gainNode)

        this.knob = new Knob(this, "Frequency", 0.3, (v) => {
            const value = Math.round(10 * v);
            this.lfoNode.frequency.setValueAtTime(value, globals.audioContext.currentTime)
        })

        const values = new Map<OscillatorType, string>()

        values.set("sine", "Sine")
        values.set("square", "Square")
        values.set("sawtooth", "Sawtooth")
        values.set("triangle", "Triangle")

        this.knob = new Knob(this, "Gain", 1, (v) => {
            const value = v;
            this.gainNode.gain.setValueAtTime(value, globals.audioContext.currentTime)
        })
        this.select = new Select(this, "Waveform", values, (v: OscillatorType) => {
            this.lfoNode.type = v
        })


        // Only output port for number
        this.outputPort1 = new AudioOutputPort(this, "Audio", this.gainNode)
    }

    stop(): void {
        this.lfoNode.stop()
        this.offsetNode.stop()
        this.lfoNode.disconnect(this.scalingNode)
        this.scalingNode.disconnect(this.adderNode)
        this.offsetNode.disconnect(this.adderNode)
        this.adderNode.disconnect(this.gainNode)
    }
}

export class OSCModule extends Module {
    oscNode: OscillatorNode
    gainNode: GainNode
    knob: Knob
    //toggle: Toggle
    select: Select
    audioOutput: AudioOutputPort
    pitchInput: CVInputPort
    lfo: boolean

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "osc", x, y);
        this.oscNode = globals.audioContext.createOscillator();
        this.oscNode.start()
        this.gainNode = globals.audioContext.createGain();
        this.oscNode.connect(this.gainNode)

        this.lfo = false;
        this.knob = new Knob(this, "Frequency", 0.3, (v) => {
                const value = 0;440 + Math.round(20 * Math.pow(1000, v));
                this.oscNode.frequency.setValueAtTime(value, globals.audioContext.currentTime)
        })
        this.knob = new Knob(this, "Gain", 1, (v) => {
            const value = v;
            this.gainNode.gain.setValueAtTime(value, globals.audioContext.currentTime)
        })

        const values = new Map<OscillatorType, string>()

        values.set("sine", "Sine")
        values.set("square", "Square")
        values.set("sawtooth", "Sawtooth")
        values.set("triangle", "Triangle")

        this.select = new Select(this, "Waveform", values, (v: OscillatorType) => {
            this.oscNode.type = v
        })


        // Only output port for number
        this.audioOutput = new AudioOutputPort(this, "Audio", this.gainNode)

        this.pitchInput = new CVInputPort(this, "Frequency Mod", this.oscNode.frequency);
    }

    stop(): void {
        this.oscNode.stop()
        this.oscNode.disconnect(this.gainNode)
    }
}

export class VCAModule extends Module {
    vca: GainNode
    knob: Knob
    audioInput: AudioInputPort
    cvInput: CVInputPort
    audioOutput: AudioOutputPort

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "vca", x, y);
        this.vca = globals.audioContext.createGain();
        this.vca.gain.setValueAtTime(0.5, globals.audioContext.currentTime);

        this.knob = new Knob(this, "Gain", 0.5, (v) => {
            const value = v;
            this.vca.gain.setValueAtTime(value, globals.audioContext.currentTime)
        })

        this.audioInput = new AudioInputPort(this, "Audio", this.vca)
        this.cvInput = new CVInputPort(this, "Modulation", this.vca.gain)
        this.audioOutput = new AudioOutputPort(this, "Audio", this.vca)
    }

    stop(): void {
        this.vca.disconnect()
    }

    onClick(e: MouseEvent): void {
    }


}

export class MixerModule extends Module {
    gainNode1: GainNode
    gainNode2: GainNode
    merger: ChannelMergerNode
    knob: Knob
    inputPort1: AudioInputPort
    inputPort2: AudioInputPort
    outputPort1: AudioOutputPort

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "mixer", x, y);
        this.gainNode1 = globals.audioContext.createGain();
        this.gainNode2 = globals.audioContext.createGain();
        this.gainNode1.gain.setValueAtTime(0.5, globals.audioContext.currentTime);
        this.gainNode2.gain.setValueAtTime(0.5, globals.audioContext.currentTime);
        this.knob = new Knob(this, "Mix", 0.5, (v) => {
            const value = v;
            this.gainNode1.gain.setValueAtTime(value, globals.audioContext.currentTime)
            this.gainNode2.gain.setValueAtTime(1 - value, globals.audioContext.currentTime)
        })



        this.merger = globals.audioContext.createChannelMerger(2);

        this.gainNode1.connect(this.merger, 0, 0)
        this.gainNode1.connect(this.merger, 0, 1)
        this.gainNode2.connect(this.merger, 0, 0)
        this.gainNode2.connect(this.merger, 0, 1)


        this.inputPort1 = new AudioInputPort(this, "Audio", this.gainNode1)
        this.inputPort2 = new AudioInputPort(this, "Audio", this.gainNode2)
        this.outputPort1 = new AudioOutputPort(this, "Audio", this.merger)

    }

    stop() {
        this.gainNode1.disconnect(this.merger)
        this.gainNode2.disconnect(this.merger)
    }
}

export class SpeakerModule extends Module {
    audioInput: AudioInputPort;

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "speaker", x, y);
        this.audioInput = new AudioInputPort(this, "Audio", globals.audioContext.destination)
    }

    stop(): void {
    }
}

// Modules.ts

export class MIDIModule extends Module {
    pitchOutput: CVOutputPort;
    gateOutput: GateOutputPort;
    constantSource: ConstantSourceNode;
    gateNode: GateNode;
    gainNode: GainNode;
    activeNotes: number[] // Set to track active notes.
    button: Button

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "midi", x, y);
        this.activeNotes = [];

        this.constantSource = globals.audioContext.createConstantSource();
        this.constantSource.start();
        this.constantSource.offset.value = 1;

        this.gateNode = new GateNode((on: boolean) => {})

        this.gainNode = globals.audioContext.createGain();
        this.gainNode.gain.setValueAtTime(440, globals.audioContext.currentTime);
        this.constantSource.connect(this.gainNode);

        this.button = new Button(this, "Play Note", 
            (e) => {
                this.handleNoteOn(68, 128)
            },
            (e) => {
                this.handleNoteOff(68)
            }
        )

        this.pitchOutput = new CVOutputPort(this, "Pitch CV", this.gainNode);
        this.gateOutput = new GateOutputPort(this, "Gate", this.gateNode);


        
    }


    handleNoteOn(note: number, velocity: number) {
        // Add the note to active notes if it's not already present.
        if (!this.activeNotes.includes(note)) {
            this.activeNotes.push(note);
        }

        // Set the frequency to the last pressed note.
        const frequency = 440 * Math.pow(2, (note - 69) / 12);
        this.gainNode.gain.setValueAtTime(frequency, this.globals.audioContext.currentTime);
        this.gateNode.setValue(true); // Gate on
    }

    handleNoteOff(note: number) {
        // Remove the note from active notes.
        const index = this.activeNotes.indexOf(note);
        if (index !== -1) {
            this.activeNotes.splice(index, 1);
        }

        // If there are still active notes, set the frequency to the last one.
        if (this.activeNotes.length > 0) {
            const lastNote = this.activeNotes[this.activeNotes.length - 1];
            const frequency = 440 * Math.pow(2, (lastNote - 69) / 12);
            this.gainNode.gain.setValueAtTime(frequency, this.globals.audioContext.currentTime);
        } else {
            this.gateNode.setValue(false); // Gate off if no notes are active.
        }
    }


    stop(): void {
        this.constantSource.disconnect()
        this.gainNode.disconnect()
    }
}


export class ADSRModule extends Module {
    gainNode: GainNode;
    gateNode: GateNode;
    constantNode: ConstantSourceNode
    gateInput: GateInputPort;
    envelopeOutput: CVOutputPort;
    attackKnob: Knob;
    decayKnob: Knob;
    sustainKnob: Knob;
    releaseKnob: Knob;

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "adsr", x, y);

        this.constantNode = globals.audioContext.createConstantSource();
        this.constantNode.start();
        this.constantNode.offset.value = 1;

        this.gainNode = globals.audioContext.createGain();
        this.gainNode.gain.setValueAtTime(0, globals.audioContext.currentTime);
        
        this.gateNode = new GateNode((on: boolean) => {
            this.handleTrigger(on);
        });

        this.constantNode.connect(this.gainNode)

        // CVInputPort for trigger
        this.gateInput = new GateInputPort(this, "Trigger", this.gateNode);
        
        // CVOutputPort for envelope
        this.envelopeOutput = new CVOutputPort(this, "Envelope", this.gainNode);

        // Knobs for each ADSR parameter
        this.attackKnob = new Knob(this, "Attack", 0.1, (value) => this.attackTime = value);
        this.decayKnob = new Knob(this, "Decay", 0.1, (value) => this.decayTime = value);
        this.sustainKnob = new Knob(this, "Sustain", 0.5, (value) => this.sustainLevel = value);
        this.releaseKnob = new Knob(this, "Release", 0.1, (value) => this.releaseTime = value);
    }

    private attackTime: number = 0.1;
    private decayTime: number = 0.1;
    private sustainLevel: number = 0.5;
    private releaseTime: number = 0.1;

    handleTrigger(on: boolean) {
        const now = this.globals.audioContext.currentTime;
        if (on) {
            // Apply attack
            this.gainNode.gain.cancelScheduledValues(now);
            //this.gainNode.gain.setValueAtTime(0, now);
            this.gainNode.gain.linearRampToValueAtTime(1, now + this.attackTime);
            // Apply decay
            this.gainNode.gain.linearRampToValueAtTime(this.sustainLevel, now + this.attackTime + this.decayTime);
        } else {
            // Apply release
            this.gainNode.gain.cancelScheduledValues(now);
            //this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0, now + this.releaseTime);
        }
    }

    stop(): void {
        this.constantNode.stop()
        this.constantNode.disconnect()
        this.gainNode.disconnect()
    }
}

export class VCFModule extends Module {
    gainNode: GainNode;
    filterNode: BiquadFilterNode;
    frequencyModInput: CVInputPort;
    audioInput: AudioInputPort;
    audioOutput: AudioOutputPort;
    frequencyKnob: Knob;
    resKnob: Knob;

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "vcf", x, y);

        this.gainNode = globals.audioContext.createGain()
        this.gainNode.gain.value = 20000
        
        // Create the filter node
        this.filterNode = globals.audioContext.createBiquadFilter();
        this.filterNode.type = 'lowpass'; // You can change this to match different filter types
        this.filterNode.frequency.setValueAtTime(1000, globals.audioContext.currentTime); // Default frequency

        this.gainNode.connect(this.filterNode.frequency)

        // Create a knob to control the base frequency of the filter
        this.frequencyKnob = new Knob(this, "Frequency", 0.5, (value) => {
            const frequency = 20 + value * 10000; // Map [0, 1] to [20, 10000] Hz
            this.filterNode.frequency.setValueAtTime(frequency, globals.audioContext.currentTime);
        });

        this.resKnob = new Knob(this, "Resonance", 0.5, (value) => {
            this.filterNode.Q.setValueAtTime(value * 5, globals.audioContext.currentTime);
        });

        // Create a CV input port for frequency modulation
        this.frequencyModInput = new CVInputPort(this, "Freq Mod", this.gainNode);

        // Create an audio input port
        this.audioInput = new AudioInputPort(this, "Audio In", this.filterNode);

        // Create an audio output port
        this.audioOutput = new AudioOutputPort(this, "Audio Out", this.filterNode);


    }

    stop(): void {
        this.filterNode.disconnect();
    }

    onClick(e: MouseEvent): void {
    }
}