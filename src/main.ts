import { Connection, safeDisconnect } from "./Connection";
import { VCAModule, OSCModule, SpeakerModule, updateConnectionPath, Module, Globals, MixerModule, LFOModule, MIDIModule, ADSRModule, VCFModule, MultiplierModule } from "./Modules";
import { Port, PortElement, OutputPort, AudioOutputPort, AudioInputPort, CVOutputPort, CVInputPort, InputPort, GateInputPort, GateOutputPort } from "./Ports";

export const globals: Globals = {
    modules: [],
    connections: [],
    draggedModule: null,
    activeModule: null,
    dragOffset: { x: 0, y: 0 },
    connectingPort: null,
    audioContext: new window.AudioContext()
};

(window as any).addMixerModule = () => {
    const module = new MixerModule(globals, 100, 100);
    globals.modules.push(module)
    return module
}

(window as any).addVCAModule = () => {
    const module = new VCAModule(globals, 100, 100);
    globals.modules.push(module)
    return module
}

(window as any).addOSCModule = () => {
    const module = new OSCModule(globals, 100, 100);
    globals.modules.push(module)
    return module
}

(window as any).addLFOModule = () => {
    const module = new LFOModule(globals, 100, 100);
    globals.modules.push(module)
    return module
}

(window as any).addSpeakerModule = () => {
    const module = new SpeakerModule(globals, 100, 100);
    globals.modules.push(module)
    return module
}

(window as any).addMIDIModule = () => {
    const module = new MIDIModule(globals, 100, 100);
    globals.modules.push(module);
    return module;
};

(window as any).addADSRModule = () => {
    const module = new ADSRModule(globals, 100, 100);
    globals.modules.push(module);
    return module;
};

(window as any).addVCFModule = () => {
    const module = new VCFModule(globals, 100, 100);
    globals.modules.push(module);
    return module;
};

(window as any).addMultiplierModule = () => {
    const module = new MultiplierModule(globals, 100, 100);
    globals.modules.push(module);
    return module;
};



export function startConnection(port: Port) {
    globals.connectingPort = port;

    document.addEventListener('mousemove', updateTempConnection);
    document.addEventListener('mouseup', finishConnection);
}

export function updateActiveModule() {
    for (const module of globals.modules) {
        if (module === globals.activeModule) {
            module.element.classList.add("active")
        } else {
            module.element.classList.remove("active")
        }
    }
}

export function deleteModule(globals: Globals) {
    if (!globals.activeModule) return;

    const module = globals.activeModule;

    // Remove all input connections
    module.inputConnections.forEach(input => {
        if (input) {
            try {
                // Safely disconnect audio nodes
                const sourcePort = input.sourcePort;
                if (sourcePort.source && input.targetPort.target) {
                    safeDisconnect(sourcePort.source, input.targetPort.target);
                }

                // Remove from source module's output connections
                const sourceModule = input.sourcePort.module;
                const outputIdx = sourceModule.outputConnections.indexOf(input);
                if (outputIdx !== -1) {
                    sourceModule.outputConnections.splice(outputIdx, 1);
                }

                // Remove from globals connections
                const globalIdx = globals.connections.indexOf(input);
                if (globalIdx !== -1) {
                    globals.connections.splice(globalIdx, 1);
                }

                // Remove the SVG path
                input.path.remove();
            } catch (e) {
                console.log("Error removing input connection:", e);
            }
        }
    });

    // Remove all output connections
    module.outputConnections.forEach(output => {
        try {
            // Safely disconnect audio nodes
            if (output.sourcePort.source && output.targetPort.target) {
                safeDisconnect(output.sourcePort.source, output.targetPort.target);
            }

            // Remove from target module's inputs
            const targetModule = output.targetPort.module;
            const inputIdx = targetModule.inputConnections.indexOf(output)

            if (inputIdx !== -1) {
                targetModule.inputConnections.splice(inputIdx, 1);
            }

            // Remove from globals connections
            const globalIdx = globals.connections.indexOf(output);
            if (globalIdx !== -1) {
                globals.connections.splice(globalIdx, 1);
            }

            // Remove the SVG path
            output.path.remove();
        } catch (e) {
            console.log("Error removing output connection:", e);
        }
    });

    // Remove module from globals.modules array
    const moduleIdx = globals.modules.indexOf(module);
    if (moduleIdx !== -1) {
        globals.modules.splice(moduleIdx, 1);
    }

    // Remove the module's HTML element and stop audio processing
    module.element.remove();
    module.stop();

    // Clear the active module reference
    globals.activeModule = null;
    updateActiveModule();
}

export function updateTempConnection(e: MouseEvent) {
    if (!globals.connectingPort) return;

    // Clear and redraw temporary connection
    const svg = document.getElementById('connections');
    const temp = document.getElementById('temp-connection');
    if (temp) temp.remove();

    const portRect = globals.connectingPort.port.getBoundingClientRect();
    const startX = portRect.left + portRect.width / 2;
    const startY = portRect.top + portRect.height / 2;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.id = 'temp-connection';
    path.setAttribute('class', 'connection active ' + globals.connectingPort.category);
    path.setAttribute('d', `M ${startX} ${startY} C ${startX + 100} ${startY}, ${e.clientX - 100} ${e.clientY}, ${e.clientX} ${e.clientY}`);
    svg?.appendChild(path);
}

export function finishConnection(e: MouseEvent) {
    document.removeEventListener('mousemove', updateTempConnection);
    document.removeEventListener('mouseup', finishConnection);

    // Deletes the dragging connectiuon
    const temp = document.getElementById('temp-connection');
    if (temp) temp.remove();

    if (!globals.connectingPort) return;

    // Find if we're over a compatible port
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const targetPort = (elements.find(el => el.classList.contains('port')) as PortElement)?.port;

    if (targetPort && targetPort !== globals.connectingPort) {
        const targetModule = targetPort.module

        if (targetModule === undefined)
            return

        if (globals.connectingPort instanceof OutputPort && targetPort.port.classList.contains('input-port')) {
            if (
                (globals.connectingPort instanceof AudioOutputPort && targetPort instanceof AudioInputPort) ||
                (globals.connectingPort instanceof CVOutputPort && targetPort instanceof CVInputPort) ||
                (globals.connectingPort instanceof GateOutputPort && targetPort instanceof GateInputPort)
            ) {
                createConnection(globals.connectingPort, targetPort);
            }
        } else if (globals.connectingPort instanceof InputPort && targetPort.port.classList.contains('output-port')) {
            if (
                (globals.connectingPort instanceof AudioInputPort && targetPort instanceof AudioOutputPort) ||
                (globals.connectingPort instanceof CVInputPort && targetPort instanceof CVOutputPort) ||
                (globals.connectingPort instanceof GateInputPort && targetPort instanceof GateOutputPort)
            ) {
                createConnection(targetPort, globals.connectingPort);
            }
        }
    }

    globals.connectingPort = null;
}

export function removeConnection(connection: Connection, globals: Globals) {
    // Safely disconnect audio nodes
    const sourcePort = connection.sourcePort;
    const targetPort = connection.targetPort;
    if (sourcePort.source && targetPort.target) {
        safeDisconnect(sourcePort.source, targetPort.target);
    }

    // Remove from source module's output connections
    const sourceModule = sourcePort.module;
    const sourceModuleIdx = sourceModule.outputConnections.indexOf(connection);
    if (sourceModuleIdx !== -1) {
        sourceModule.outputConnections.splice(sourceModuleIdx, 1);
    }

    // Remove from target module's input connections
    const targetModule = targetPort.module;
    const targetModuleIdx = targetModule.inputConnections.indexOf(connection);
    if (targetModuleIdx !== -1) {
        targetModule.inputConnections.splice(targetModuleIdx, 1);
    }

    // Remove from globals connections
    const globalIdx = globals.connections.indexOf(connection);
    if (globalIdx !== -1) {
        globals.connections.splice(globalIdx, 1);
    }

    // Remove the SVG path
    connection.path.remove();
}

export function handleConnectionRemoval(port: Port, globals: Globals) {
    if (port instanceof InputPort) {
        // Find the input object for this port
        const connection = port.module.inputConnections.find((input) => input.targetPort === port);
        if (connection) {
            removeConnection(connection, globals);
        }
    }
}


export function createConnection(sourcePort: OutputPort, targetPort: InputPort) {
    const svg = document.getElementById('connections');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'connection ' + sourcePort.category);

    if (targetPort.module === sourcePort.module)
        return

    const connection = new Connection(
        path,
        //sourceModule,
        //targetModule,
        sourcePort,
        targetPort
    );

    handleConnectionRemoval(targetPort, globals);


    sourcePort.module.outputConnections.push(connection);
    targetPort.module.inputConnections.push(connection);
    globals.connections.push(connection);
    svg?.appendChild(path);
    updateConnectionPath(connection);
    sourcePort.module.updateConnected();
}


// Handle module dragging
document.addEventListener('mousedown', (e) => {
    const element = document.elementFromPoint(e.clientX, e.clientY)
    if (element === document.body) {
        globals.activeModule = null;
        updateActiveModule()
    }

});

// Handle module dragging
document.addEventListener('mousemove', (e) => {
    if (globals.draggedModule) {
        const x = e.clientX - globals.dragOffset.x;
        const y = e.clientY - globals.dragOffset.y;
        globals.draggedModule.updatePosition(x, y);
    }
});

document.addEventListener('mouseup', () => {
    globals.draggedModule = null;
});

// Add keyboard event listener for delete key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteModule(globals);
    }
});

// Initialize SVG size
function updateSVGSize() {
    const svg = document.getElementById('connections');
    svg?.setAttribute('width', window.innerWidth.toString());
    svg?.setAttribute('height', window.innerHeight.toString());
}

export async function initializeMIDI() {
    if (!navigator.requestMIDIAccess) {
        console.error("MIDI not supported in this browser.");
        return;
    }
    const midiAccess = await navigator.requestMIDIAccess();

    midiAccess.inputs.forEach(input => {
        input.onmidimessage = handleMIDIMessage;
    });
}

function handleMIDIMessage(event: WebMidi.MIDIMessageEvent) {
    const [command, note, velocity] = event.data;
    const cmd = command & 0xF0;

    const midiModule = globals.modules.find(m => m instanceof MIDIModule) as MIDIModule;

    // Check if the message is a pitch bend message
    if (cmd === 0xE0) {
        const channel = command & 0x0F;
        const pitchBendValue = ((velocity << 7) | note) - 8192; // Centered at 0
        
        midiModule.handlePitchBend(pitchBendValue, channel);
    }

    if (midiModule) {
        if (command === 0x90 && velocity > 0) { // Note on
            midiModule.handleNoteOn(note, velocity);
        } else if (command === 0x80 || (command === 0x90 && velocity === 0)) { // Note off
            midiModule.handleNoteOff(note);
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener('resize', updateSVGSize);
    updateSVGSize();
});

(window as any).start = function start() {
    initializeMIDI();
    const midi = (window as any).addMIDIModule() as MIDIModule
    midi.updatePosition(10, 100)
    const mult = (window as any).addMultiplierModule() as MultiplierModule
    mult.updatePosition(200, 640)
    mult.select.setValue("200")
    const adsr = (window as any).addADSRModule() as ADSRModule
    adsr.updatePosition(200, 100)
    const osc = (window as any).addOSCModule() as OSCModule
    osc.updatePosition(400, 100)
    const vca = (window as any).addVCAModule() as VCAModule
    vca.updatePosition(600, 100);
    const speaker = (window as any).addSpeakerModule() as SpeakerModule
    speaker.updatePosition(800, 100);

    createConnection(adsr.envelopeOutput, vca.cvInput)
    createConnection(midi.pitchBendOutput, mult.cvInput)
    createConnection(mult.cvOutput, osc.detuneInput)
    createConnection(midi.gateOutput, adsr.gateInput)
    createConnection(midi.pitchOutput, osc.pitchInput)
    createConnection(osc.audioOutput, vca.audioInput)
    createConnection(vca.audioOutput, speaker.audioInput)
};

(window as any).save = function save() {
    const modules = globals.modules.map(m => m.serialize())
    const connections = globals.connections.map(c => c.serialize())
    const json = JSON.stringify({modules, connections}, null, 4)
    localStorage.setItem("saved-setup", json)
    console.log(json)
};


(window as any).load = function load() {
    initializeMIDI();

    const json = localStorage.getItem("saved-setup")

    if (json) {
        const saved = JSON.parse(json)
        const modules = saved.modules;
        const connections = saved.connections;

        for (const module of modules) {
            const m = Module.fromJSON(globals, module)
            m.id = module.id;
            globals.modules.push(m)
        }

        for (const connection of connections) {
            const mSource = globals.modules.find((m: Module) => m.id === connection.sourceId)
            const mTarget = globals.modules.find((m: Module) => m.id === connection.targetId)
            
            if (mSource && mTarget) {                
                createConnection((mSource as any)[connection.source], (mTarget as any) [connection.target])
            }
        }
    }
}
