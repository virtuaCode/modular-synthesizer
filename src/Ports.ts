import { safeDisconnect } from "./Connection";
import { startConnection, updateTempConnection } from "./main";
import { Module } from "./Modules";
import { GateNode } from "./Nodes";



export interface Source {
    connect: (target: any) => any
    disconnect: (target: any) => any
}

export interface Target {

}

export class PortElement extends HTMLDivElement {
    port: Port | undefined
}

export abstract class Port {
    port: PortElement;
    

    constructor(
        public module: Module, 
        public readonly title: string,
        public readonly id: string,
    ) {
        this.port = document.createElement('div') as PortElement;
        this.port.className = 'port';
        this.port.title = title;

        this.port.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            if (this instanceof InputPort) {
                // Find the input object for this port
                const connection = this.module.inputConnections.find(input => input.targetPort.port.port === this);
                if (connection) {
                    // Get references before removal
                    const existingConnection = connection;
                    const sourcePort = existingConnection.sourcePort;
                    const sourceModule = existingConnection.sourcePort.module;
                    
                    // Disconnect audio nodes first

                    safeDisconnect(sourcePort.source, this.target)
                    
                    // Remove connection from target module's input connections
                    const targetModuleIdx = this.module.inputConnections.indexOf(existingConnection);
                    if (targetModuleIdx !== -1) {
                        this.module.inputConnections.splice(targetModuleIdx, 1);
                    }

                    // Remove from source module's output connections
                    const sourceModuleIdx = sourceModule.outputConnections.indexOf(existingConnection);
                    if (sourceModuleIdx !== -1) {
                        sourceModule.outputConnections.splice(sourceModuleIdx, 1);
                    }
                    
                    // Remove from globals connections
                    const globalIdx = this.module.globals.connections.indexOf(existingConnection);
                    if (globalIdx !== -1) {
                        this.module.globals.connections.splice(globalIdx, 1);
                    }
                    
                    // Remove the SVG path
                    existingConnection.path.remove();
                    
                    // Start a new connection from the original output port
                    startConnection(sourcePort);
                    updateTempConnection(e);
                    return;
                }
            }
            startConnection(this);
        });
        this.port.port = this;
        this.module.element.appendChild(this.port);
    }

    
    public get category() : 'cv' | 'audio' | 'gate' | 'none' {
        return 'none'
    }
    
}

export abstract class InputPort extends Port{
    constructor(module: Module, title: string, id: string, public readonly target: Target) {
        super(module, title, id)
        this.port.className += ' input-port'
    }
}

export abstract class OutputPort extends Port{
    constructor(module: Module, title: string, id: string, public readonly source: Source) {
        super(module, title, id)
        this.port.className += ' output-port'
    }
}

export class CVInputPort extends InputPort {
    constructor(module: Module, title: string, id: string, target: Target) {
        super(module, title, id, target);
        this.port.className += ' cv-port'
    }


    public get category(): 'cv' {
        return 'cv'
    }

}

export class CVOutputPort extends OutputPort {
    constructor(module: Module, title: string, id: string, source: Source) {
        super(module, title, id, source);
        this.port.className += ' cv-port';
        
    }

    public get category(): 'cv' {
        return 'cv'
    }
}

export class GateInputPort extends InputPort {
    constructor(module: Module, title: string, id: string, target: GateNode) {
        super(module, title, id, target);
        this.port.className += ' gate-port'
    }


    public get category(): 'gate' {
        return 'gate'
    }

}

export class GateOutputPort extends OutputPort {
    constructor(module: Module, title: string, id: string, source: GateNode) {
        super(module, title, id, source);
        this.port.className += ' gate-port';
        
    }

    public get category(): 'gate' {
        return 'gate'
    }
}



export class AudioInputPort extends InputPort {
    constructor(module: Module, title: string, id: string, target: Target) {
        super(module, title, id, target);
        this.port.className += ' audio-port'
    }

    public get category(): 'audio' {
        return 'audio'
    }
}

export class AudioOutputPort extends OutputPort {
    constructor(module: Module, title: string, id: string, source: Source) {
        super(module, title, id, source);
        this.port.className += ' audio-port'
    }

    public get category(): 'audio' {
        return 'audio'
    }
}
