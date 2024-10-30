import { Connection } from "./Connection";
import { Button, TextInput, Knob, Select, Toggle } from "./UI";
import { Port, InputPort, CVOutputPort, AudioOutputPort, AudioInputPort, CVInputPort, GateOutputPort, GateInputPort } from "./Ports";
import { GateNode } from "./Nodes";
import { updateActiveModule } from "./main";

const nameof = <T>(name: keyof T) => name;

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

export interface RecordType {
    [key: string]: any;
}

export abstract class Module implements RecordType {
    x: number;
    y: number;
    id: string;
    outputConnections: Connection[];
    ports: Port[];
    element: HTMLElement;
    inputConnections: Connection[]


    constructor(public readonly globals: Globals, private readonly type: string, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.id = 'module-' + self.crypto.randomUUID();
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

    serialize(): { [key: string]: string | number } {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y
        }
    }

    static fromJSON(globals: Globals, m: any) {
        switch (m.type) {
            case "multiplier":
                return new MultiplierModule(globals, m.x, m.y, m.amount)

            case "lfo":
                return new LFOModule(globals, m.x, m.y, m.frequency, m.gain, m.oscType)

            case "osc":
                return new OSCModule(globals, m.x, m.y, m.frequency, m.detune, m.gain, m.oscType)

            case "vca":
                return new VCAModule(globals, m.x, m.y, m.gain)

            case "mixer":
                return new MixerModule(globals, m.x, m.y, m.gain)

            case "speaker":
                return new SpeakerModule(globals, m.x, m.y)

            case "midi":
                return new MIDIModule(globals, m.x, m.y)

            case "adsr":
                return new ADSRModule(globals, m.x, m.y, m.attack, m.decay, m.sustain, m.release)

            case "vcf":
                return new VCFModule(globals, m.x, m.y, m.frequency, m.resonance)

            default:
                throw new Error("");
                
                
        }

    }
}


export class MultiplierModule extends Module {

    scalingNode: GainNode
    select: TextInput
    cvInput: CVInputPort
    cvOutput: CVOutputPort

    constructor(globals: Globals, x: number, y: number, amount = "1") {
        super(globals, "multiplier", x, y);

        this.scalingNode = globals.audioContext.createGain();
        this.scalingNode.gain.value = 1;

        this.select = new TextInput(this, "Amount", amount, (e) => {
            const num = Number.parseFloat((e.target as HTMLInputElement).value)

            if (Number.isNaN(num))
                return

            if (!Number.isFinite(num))
                return

            this.scalingNode.gain.setValueAtTime(num, globals.audioContext.currentTime)
        })

        this.cvInput = new CVInputPort(this, "CV", nameof<MultiplierModule>("cvInput"), this.scalingNode)
        this.cvOutput = new CVOutputPort(this, "CV", nameof<MultiplierModule>("cvOutput"), this.scalingNode)
    }

    stop(): void {
        this.scalingNode.disconnect()
    }

    serialize() {
        const m = super.serialize()
        m.amount = this.select.getValue()
        return m
    }
}


export class LFOModule extends Module {
    lfoNode: OscillatorNode
    scalingNode: GainNode
    adderNode: GainNode
    gainNode: GainNode
    offsetNode: ConstantSourceNode
    knob: Knob
    select: Select
    cvOutput: CVOutputPort

    constructor(globals: Globals, x: number, y: number, frequency = 0.3, gain = 1, oscType: OscillatorType = "sawtooth") {
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

        this.knob = new Knob(this, "Frequency", frequency, (v) => {
            const value = Math.round(10 * v);
            this.lfoNode.frequency.setValueAtTime(value, globals.audioContext.currentTime)
        })

        const values = new Map<OscillatorType, string>()

        values.set("sine", "Sine")
        values.set("square", "Square")
        values.set("sawtooth", "Sawtooth")
        values.set("triangle", "Triangle")

        this.knob = new Knob(this, "Gain", gain, (v) => {
            const value = v;
            this.gainNode.gain.setValueAtTime(value, globals.audioContext.currentTime)
        })
        this.select = new Select(this, "Waveform", values, oscType, (v: OscillatorType) => {
            this.lfoNode.type = v
        })


        // Only output port for number
        this.cvOutput = new CVOutputPort(this, "CV", nameof<LFOModule>("cvOutput"), this.gainNode)
    }

    stop(): void {
        this.lfoNode.stop()
        this.offsetNode.stop()
        this.lfoNode.disconnect(this.scalingNode)
        this.scalingNode.disconnect(this.adderNode)
        this.offsetNode.disconnect(this.adderNode)
        this.adderNode.disconnect(this.gainNode)
    }

    serialize() {
        const m = super.serialize()
        m.frequency = this.knob.getValue()
        m.gain = this.knob.getValue()
        m.oscType = this.select.getValue()
        return m
    }
}

export class OSCModule extends Module {
    oscNode: OscillatorNode
    gainNode: GainNode
    frequencyKnob: Knob
    detuneKnob: Knob
    gainKnob: Knob
    //toggle: Toggle
    select: Select
    audioOutput: AudioOutputPort
    pitchInput: CVInputPort
    detuneInput: CVInputPort
    lfo: boolean

    constructor(
        globals: Globals,
        x: number,
        y: number,
        frequency: number = 0,
        detune: number = 0,
        gain: number = 1,
        oscType: OscillatorType = "sawtooth"
    ) {
        super(globals, "osc", x, y);
        this.oscNode = globals.audioContext.createOscillator();
        this.oscNode.start()
        this.gainNode = globals.audioContext.createGain();
        this.oscNode.connect(this.gainNode)

        this.lfo = false;
        this.frequencyKnob = new Knob(this, "Frequency", frequency, (v) => {
            const value = Math.round(Math.pow(10000, v));
            this.oscNode.frequency.setValueAtTime(value, globals.audioContext.currentTime)
        })
        this.detuneKnob = new Knob(this, "Detune", detune, (v) => {
            this.oscNode.detune.setValueAtTime(v * 1200, globals.audioContext.currentTime)
        })
        this.gainKnob = new Knob(this, "Gain", gain, (v) => {
            const value = v;
            this.gainNode.gain.setValueAtTime(value, globals.audioContext.currentTime)
        })

        const values = new Map<OscillatorType, string>()

        values.set("sawtooth", "Sawtooth")
        values.set("square", "Square")
        values.set("triangle", "Triangle")
        values.set("sine", "Sine")

        this.select = new Select(this, "Waveform", values, oscType, (v: OscillatorType) => {
            this.oscNode.type = v
        })


        // Only output port for number
        this.audioOutput = new AudioOutputPort(this, "Audio", nameof<OSCModule>("audioOutput"), this.gainNode)

        this.pitchInput = new CVInputPort(this, "Frequency Mod", nameof<OSCModule>("pitchInput"), this.oscNode.frequency);
        this.detuneInput = new CVInputPort(this, "Detune Mod", nameof<OSCModule>("detuneInput"), this.oscNode.detune);
    }

    stop(): void {
        this.oscNode.stop()
        this.oscNode.disconnect(this.gainNode)
    }

    serialize() {
        const m = super.serialize()
        m.frequency = this.frequencyKnob.getValue()
        m.detune = this.detuneKnob.getValue()
        m.gain = this.gainKnob.getValue()
        m.oscType = this.select.getValue()
        return m
    }
}

export class VCAModule extends Module {
    vca: GainNode
    gainKnob: Knob
    audioInput: AudioInputPort
    cvInput: CVInputPort
    audioOutput: AudioOutputPort

    constructor(globals: Globals, x: number, y: number, gain: number = 0) {
        super(globals, "vca", x, y);
        this.vca = globals.audioContext.createGain();
        this.vca.gain.setValueAtTime(gain, globals.audioContext.currentTime);

        this.gainKnob = new Knob(this, "Gain", gain, (v) => {
            const value = v;
            this.vca.gain.setValueAtTime(value, globals.audioContext.currentTime)
        })

        this.audioInput = new AudioInputPort(this, "Audio", nameof<VCAModule>("audioInput"), this.vca)
        this.cvInput = new CVInputPort(this, "Modulation", nameof<VCAModule>("cvInput"), this.vca.gain)
        this.audioOutput = new AudioOutputPort(this, "Audio", nameof<VCAModule>("audioOutput"),this.vca)
    }

    stop(): void {
        this.vca.disconnect()
    }

    onClick(e: MouseEvent): void {
    }

    serialize(): { [key: string]: string | number; } {
        const m = super.serialize()
        m.gain = this.gainKnob.getValue()
        return m
    }


}

export class MixerModule extends Module {
    gainNode1: GainNode
    gainNode2: GainNode
    merger: ChannelMergerNode
    gainKnob: Knob
    audioInput1: AudioInputPort
    audioInput2: AudioInputPort
    audioOutput: AudioOutputPort

    constructor(globals: Globals, x: number, y: number, gain = 0.5) {
        super(globals, "mixer", x, y);
        this.gainNode1 = globals.audioContext.createGain();
        this.gainNode2 = globals.audioContext.createGain();
        this.gainNode1.gain.setValueAtTime(gain, globals.audioContext.currentTime);
        this.gainNode2.gain.setValueAtTime(1 - gain, globals.audioContext.currentTime);
        this.gainKnob = new Knob(this, "Mix", gain, (v) => {
            const value = v;
            this.gainNode1.gain.setValueAtTime(value, globals.audioContext.currentTime)
            this.gainNode2.gain.setValueAtTime(1 - value, globals.audioContext.currentTime)
        })



        this.merger = globals.audioContext.createChannelMerger(2);

        this.gainNode1.connect(this.merger, 0, 0)
        this.gainNode1.connect(this.merger, 0, 1)
        this.gainNode2.connect(this.merger, 0, 0)
        this.gainNode2.connect(this.merger, 0, 1)


        this.audioInput1 = new AudioInputPort(this, "Audio", nameof<MixerModule>("audioInput1"), this.gainNode1)
        this.audioInput2 = new AudioInputPort(this, "Audio", nameof<MixerModule>("audioInput2"), this.gainNode2)
        this.audioOutput = new AudioOutputPort(this, "Audio", nameof<MixerModule>("audioOutput"),this.merger)

    }

    stop() {
        this.gainNode1.disconnect(this.merger)
        this.gainNode2.disconnect(this.merger)
    }

    serialize(): { [key: string]: string | number; } {
        const m = super.serialize()
        m.gain = this.gainKnob.getValue()
        return m
    }
}

export class SpeakerModule extends Module {
    audioInput: AudioInputPort;

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "speaker", x, y);
        this.audioInput = new AudioInputPort(this, "Audio", nameof<SpeakerModule>("audioInput"), globals.audioContext.destination)
    }

    stop(): void {
    }
}

// Modules.ts

export class MIDIModule extends Module {
    pitchOutput: CVOutputPort;
    pitchBendOutput: CVOutputPort;
    gateOutput: GateOutputPort;
    constantSource: ConstantSourceNode;
    bendSource: ConstantSourceNode;
    gateNode: GateNode;
    gainNode: GainNode;
    activeNotes: number[] // Set to track active notes.
    button: Button

    constructor(globals: Globals, x: number, y: number) {
        super(globals, "midi", x, y);
        this.activeNotes = [];

        this.bendSource = globals.audioContext.createConstantSource();
        this.bendSource.start();
        this.bendSource.offset.value = 0;

        this.constantSource = globals.audioContext.createConstantSource();
        this.constantSource.start();
        this.constantSource.offset.value = 1;

        this.gateNode = new GateNode((on: boolean) => { })

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

        this.pitchBendOutput = new CVOutputPort(this, "Pitch Bend CV", nameof<MIDIModule>("pitchBendOutput"), this.bendSource);
        this.pitchOutput = new CVOutputPort(this, "Pitch CV",nameof<MIDIModule>("pitchOutput"), this.gainNode);
        this.gateOutput = new GateOutputPort(this, "Gate", nameof<MIDIModule>("gateOutput"), this.gateNode);



    }


    handlePitchBend(pitchBendValue: number, channel: number) {
        this.bendSource.offset.setValueAtTime(pitchBendValue / 8192, this.globals.audioContext.currentTime)
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

    constructor(
        globals: Globals,
        x: number,
        y: number,
        private attack = 0.1,
        private decay = 0.1,
        private sustain = 0.5,
        private release = 0.1
    ) {
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


        // Knobs for each ADSR parameter
        this.attackKnob = new Knob(this, "Attack", attack, (value) => {
            this.attack = value
        });
        this.decayKnob = new Knob(this, "Decay", decay, (value) => {
            this.decay = value
        });
        this.sustainKnob = new Knob(this, "Sustain", sustain, (value) => {
            this.sustain = value
        });
        this.releaseKnob = new Knob(this, "Release", release, (value) => {
            this.release = value
        });

        // CVInputPort for trigger
        this.gateInput = new GateInputPort(this, "Trigger", nameof<ADSRModule>("gateInput"), this.gateNode);

        // CVOutputPort for envelope
        this.envelopeOutput = new CVOutputPort(this, "Envelope", nameof<ADSRModule>("envelopeOutput"), this.gainNode);

    }

    handleTrigger(on: boolean) {
        const now = this.globals.audioContext.currentTime;
        if (on) {
            // Apply attack
            this.gainNode.gain.cancelScheduledValues(now);
            //this.gainNode.gain.setValueAtTime(0, now);
            this.gainNode.gain.linearRampToValueAtTime(1, now + this.attack);
            // Apply decay
            this.gainNode.gain.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
        } else {
            // Apply release
            this.gainNode.gain.cancelScheduledValues(now);
            //this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0, now + this.release);
        }
    }

    stop(): void {
        this.constantNode.stop()
        this.constantNode.disconnect()
        this.gainNode.disconnect()
    }

    serialize(): { [key: string]: string | number; } {
        const m = super.serialize()
        m.attack = this.attackKnob.getValue()
        m.decay = this.decayKnob.getValue()
        m.sustain = this.sustainKnob.getValue()
        m.release = this.releaseKnob.getValue()
        return m
    }
}

export class VCFModule extends Module {
    gainNode: GainNode;
    filterNode: BiquadFilterNode;
    frequencyModInput: CVInputPort;
    audioInput: AudioInputPort;
    audioOutput: AudioOutputPort;
    frequencyKnob: Knob;
    resonanceKnob: Knob;

    constructor(globals: Globals, x: number, y: number, frequency = 0.5, resonance = 0.5) {
        super(globals, "vcf", x, y);

        this.gainNode = globals.audioContext.createGain()
        this.gainNode.gain.value = 10000

        // Create the filter node
        this.filterNode = globals.audioContext.createBiquadFilter();
        this.filterNode.type = 'lowpass'; // You can change this to match different filter types
        this.filterNode.frequency.setValueAtTime(1000, globals.audioContext.currentTime); // Default frequency

        this.gainNode.connect(this.filterNode.frequency)

        // Create a knob to control the base frequency of the filter
        this.frequencyKnob = new Knob(this, "Frequency", frequency, (value) => {
            const frequency = 20 + value * 10000; // Map [0, 1] to [20, 10000] Hz
            this.filterNode.frequency.setValueAtTime(frequency, globals.audioContext.currentTime);
        });

        this.resonanceKnob = new Knob(this, "Resonance", resonance, (value) => {
            this.filterNode.Q.setValueAtTime(value * 5, globals.audioContext.currentTime);
        });


        // Create an audio input port
        this.audioInput = new AudioInputPort(this, "Audio In",nameof<VCFModule>("audioInput"), this.filterNode);

        // Create a CV input port for frequency modulation
        this.frequencyModInput = new CVInputPort(this, "Freq Mod", nameof<VCFModule>("frequencyModInput"), this.gainNode);

        // Create an audio output port
        this.audioOutput = new AudioOutputPort(this, "Audio Out",nameof<VCFModule>("audioOutput"), this.filterNode);


    }

    stop(): void {
        this.filterNode.disconnect();
        this.gainNode.disconnect()
    }

    onClick(e: MouseEvent): void {
    }

    serialize(): { [key: string]: string | number; } {
        const m = super.serialize()
        m.frequency = this.frequencyKnob.getValue()
        m.resonance = this.resonanceKnob.getValue()
        return m
    }
}