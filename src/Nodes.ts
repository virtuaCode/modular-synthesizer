import { Source, Target } from "./Ports";

export class GateNode implements Source, Target{
    private isConnected: boolean = false;
    private value: boolean = false;
    private outputs: Set<GateNode> = new Set();
    private onChangeCallback: (value: boolean) => void;

    constructor(onChangeCallback: (value: boolean) => void) {
        this.onChangeCallback = onChangeCallback;
    }

    connect(target: GateNode): void {
        if (this.outputs.has(target)) {
            return;
        }
        this.outputs.add(target);
        this.isConnected = true;
        target.setValue(this.value); // Propagate current value
    }

    disconnect(target: GateNode): void {
        if (!this.outputs.has(target)) {
            return;
        }
        this.outputs.delete(target);
        if (this.outputs.size === 0) {
            this.isConnected = false;
        }
    }

    setValue(value: boolean): void {
        if (this.value !== value) {
            this.value = value;
            this.propagate();
            this.onChangeCallback(this.value);
        }
    }

    getValue(): boolean {
        return this.value;
    }

    private propagate(): void {
        this.outputs.forEach(target => {
            target.setValue(this.value);
        });
    }
}