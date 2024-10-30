import { Module } from "./Modules";
import { GateNode } from "./Nodes";
import { OutputPort, InputPort } from "./Ports";

export class Connection {
    constructor(
        public readonly path: SVGPathElement,
        //public readonly sourceModule: Module,
        //public readonly targetModule: Module,
        public readonly sourcePort: OutputPort,
        public readonly targetPort: InputPort) {
    }

    remove() {
        try {
            // Only disconnect if the target is an AudioNode or AudioParam
            this.sourcePort.source.disconnect(this.targetPort.target);
        } catch (e) {
            // Ignore disconnect errors - the connection may already be disconnected
            console.log("Connection already disconnected");
        }
    }

    serialize() {
        return {
            sourceId: this.sourcePort.module.id,
            targetId: this.targetPort.module.id,
            source: this.sourcePort.id,
            target: this.targetPort.id
        }
    }
}

// Helper function to safely disconnect audio nodes
export function safeDisconnect(source: any, target: any) {
    try {
        if (source && target) {
            source.disconnect(target);
        }
    } catch (e) {
        // Ignore disconnect errors
        console.log("Audio node already disconnected");
    }
}