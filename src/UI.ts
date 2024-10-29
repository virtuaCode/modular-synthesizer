import { Module } from "./Modules";

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

export class Select {
    element: HTMLElement
    select: HTMLSelectElement | null
    label: HTMLDivElement | null


    constructor(module: Module, name: string, value: Map<OscillatorType, string>, callback: (v: OscillatorType) => any) {
        let temp = document.getElementById("template-select") as HTMLTemplateElement;

        if (temp === null)
            throw new Error("template select not found");
            
        this.element = temp.content.cloneNode(true) as HTMLElement;
        this.select = this.element.querySelector("select");

        for(const key of Array.from(value.keys())) {
            const option = document.createElement('option')
            option.value = key
            option.textContent = value.get(key) || ""
            this.select?.appendChild(option)
        }

        this.label = this.element.querySelector(".label");

        if (this.label === null)
            throw new Error("label is not defined");

        this.label.textContent = name;

        module.element.appendChild(this.element);

        this.select?.addEventListener('change', function handleChange(event: any) {
            callback(event.target.value);
        });
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

export class Knob {
    rotating: boolean;
    startY: number;
    startRotation: number;
    element: HTMLElement;
    knob: HTMLElement | null;
    label: HTMLElement | null;


    constructor(module: Module, name: string, value: number, private callback: (v: number) => any) {
        this.rotating = false;
        this.startRotation = value * 300;
        this.startY = 0;
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
                const value = rotation / 300;
                callback(value);
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

        // Update audio parameters
        this.callback(value);
    }
}
