import { Module } from "./Modules";

export interface HasValue {
    getValue(): number | string 
}

export class Button {
    element: HTMLElement

    constructor(module: Module, name: string, onDown: (e: MouseEvent) => any, onUp: (e: MouseEvent) => any) {
        let temp = document.getElementById("template-button") as HTMLTemplateElement;

        if (temp === null)
            throw new Error("template button not found");

        this.element = temp.content.cloneNode(true) as HTMLElement;

        const button = this.element.querySelector("button")

        // Add a mouseup event listener to the button
        button?.addEventListener('mousedown', onDown.bind(this));
        button?.addEventListener('mouseup', onUp.bind(this));

        if (button)
            button.textContent = name;

        module.element.appendChild(this.element);
    }
}

export class TextInput implements HasValue {
    element: HTMLElement
    label: HTMLElement | null
    input: HTMLInputElement | null

    constructor(module: Module, name: string, value: string, onChange: (e: Event) => any) {
        let temp = document.getElementById("template-input") as HTMLTemplateElement;

        if (temp === null)
            throw new Error("template input not found");

        this.element = temp.content.cloneNode(true) as HTMLElement;

        this.label = this.element.querySelector(".label");

        if (this.label === null)
            throw new Error("label is not defined");

        this.label.textContent = name;

        this.input = this.element.querySelector("input")

        this.input?.addEventListener('change', onChange.bind(this));
        this.input?.addEventListener('keydown', (e: KeyboardEvent) => {
            e.stopPropagation()
        })
        this.input?.addEventListener('mousemove', (e: MouseEvent) => {
            e.stopPropagation()
        })

        this.setValue(value)
        module.element.appendChild(this.element);
    }
    getValue(): number | string {
        if (this.input)
            return this.input.value;
        else 
            return ""
    }

    setValue(value: string) {
        if (this.input)
            this.input.value = value

        const event = new Event('change', { bubbles: true });
        this.input?.dispatchEvent(event)
    }
}

export class Select implements HasValue {
    element: HTMLElement
    select: HTMLSelectElement | null
    label: HTMLDivElement | null


    constructor(module: Module, name: string, values: Map<OscillatorType, string>, value: OscillatorType, callback: (v: OscillatorType) => any) {
        let temp = document.getElementById("template-select") as HTMLTemplateElement;

        if (temp === null)
            throw new Error("template select not found");
            
        this.element = temp.content.cloneNode(true) as HTMLElement;
        this.select = this.element.querySelector("select");

        for(const key of Array.from(values.keys())) {
            const option = document.createElement('option')
            option.value = key
            option.textContent = values.get(key) || ""
            this.select?.appendChild(option)
        }

        if (this.select)
            this.select.value = value

        this.label = this.element.querySelector(".label");

        if (this.label === null)
            throw new Error("label is not defined");

        this.label.textContent = name;

        module.element.appendChild(this.element);

        this.select?.addEventListener('change', function handleChange(event: any) {
            callback(event.target.value);
        });
        callback(value)
    }

    getValue(): number | string {
        if (this.select)
            return this.select.value
        else 
            return ""
    }
}

export class Toggle {
    element: HTMLElement
    checkbox: HTMLInputElement | null
    label: HTMLDivElement | null


    constructor(module: Module, name: string, value: boolean, callback: (v: boolean) => any) {
        let temp = document.getElementById("template-toggle") as HTMLTemplateElement;

        if (temp === null)
            throw new Error("template toggle not found");
            
        this.element = temp.content.cloneNode(true) as HTMLElement;
        this.checkbox = this.element.querySelector("input");

        if (this.checkbox === null)
            throw new Error("label is not defined");

        this.label = this.element.querySelector(".label");

        if (this.label === null)
            throw new Error("label is not defined");

        this.label.textContent = name;

        module.element.appendChild(this.element);

        this.checkbox?.addEventListener('change', function handleChange(event: any) {
            callback(event.target.checked);
        });

        this.checkbox.checked = value;
        callback(value)
    }
}

export class Knob implements HasValue{
    rotating: boolean;
    startY: number;
    startRotation: number;
    value: number;
    element: HTMLElement;
    knob: HTMLElement | null;
    label: HTMLElement | null;


    constructor(module: Module, name: string, value: number, private callback: (v: number) => any) {
        this.rotating = false;
        this.startRotation = value * 300;
        this.startY = 0;
        this.value = value;
        let temp = document.getElementById("template-knob") as HTMLTemplateElement;

        if (temp === null)
            throw new Error("template knob not found");
            
        this.element = temp.content.cloneNode(true) as HTMLElement;
        this.knob = this.element.querySelector(".knob");

        if (this.knob === null)
            throw new Error("knob is not defined");

        this.label = this.element.querySelector(".label");

        if (this.label === null)
            throw new Error("label is not defined");

        this.label.textContent = name;
        module.element.appendChild(this.element);
        this.knob.style.transform = `rotate(${this.startRotation}deg)`;
        callback(this.startRotation / 300);

        this.knob.addEventListener('mousedown', e => {
            this.rotating = true;
            this.startY = e.clientY;
            const transform = this.knob?.style.transform;
            this.startRotation = transform ? parseInt(transform.match(/rotate\((\d+)deg\)/)?.[1] || "0") : 0;
            e.stopPropagation();
        });

        document.addEventListener('mousemove', e => {
            if (this.rotating) {
                const deltaY = this.startY - e.clientY;
                const rotation = Math.min(300, Math.max(0, this.startRotation + deltaY));

                if (this.knob === null)
                    throw new Error("knob is not defined");


                this.knob.style.transform = `rotate(${rotation}deg)`;

                // Update audio parameters
                this.value = rotation / 300;
                callback(this.value);
                e.stopPropagation();
            }
        });

        document.addEventListener('mouseup', () => {
            this.rotating = false;
        });

    }

    setValue(value: number) {

        if (this.knob === null)
            throw new Error("knob is not defined");

        const rotation = value * 300;
        
        this.knob.style.transform = `rotate(${rotation}deg)`;
        this.value = value
        // Update audio parameters
        this.callback(value);
    }

    getValue(): number | string {
        return this.value
    }
}
