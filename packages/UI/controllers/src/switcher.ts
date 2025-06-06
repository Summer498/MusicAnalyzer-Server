import { Controller, createController } from "./controller";

export class Checkbox implements Controller<boolean> {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  readonly listeners: ((e: boolean) => void)[];
  addListeners: (...listeners: ((e: boolean) => void)[]) => void;
  constructor(id: string, label: string) {
    const c = createController<boolean>("checkbox", id, label);
    this.body = c.body;
    this.input = c.input;
    this.listeners = c.listeners;
    this.addListeners = c.addListeners.bind(c);
    c.update = () => this.update();

    this.input.checked = false;
    this.update();
  }
  update() {
    this.listeners.forEach(e => e(this.input.checked));
  }
}

export class DMelodyController {
  readonly view: HTMLDivElement;
  readonly checkbox: Checkbox;
  constructor() {
    const d_melody_switcher = new Checkbox("d_melody_switcher", "detected melody before fix");
    this.view = document.createElement("div");
    this.view.id = "d-melody";
    this.view.appendChild(d_melody_switcher.body);
    this.checkbox = d_melody_switcher;
  };
  addListeners(...listeners: ((e:boolean) => void)[]) { this.checkbox.addListeners(...listeners); }
}

export class ImplicationDisplayController {
  readonly view: HTMLDivElement;
  readonly prospective_checkbox: Checkbox;
  readonly retrospective_checkbox: Checkbox;
  readonly reconstructed_checkbox: Checkbox;
  constructor() {
    const prospective_checkbox = new Checkbox("prospective_checkbox", "prospective implication");
    const retrospective_checkbox = new Checkbox("retrospective_checkbox", "retrospective implication");
    const reconstructed_checkbox = new Checkbox("reconstructed_checkbox", "reconstructed implication");
    this.view = document.createElement("div");
    this.view.id = "prospective-implication";
    this.view.appendChild(prospective_checkbox.body);
    this.view.appendChild(retrospective_checkbox.body);
    this.view.appendChild(reconstructed_checkbox.body);
    this.prospective_checkbox = prospective_checkbox;
    this.retrospective_checkbox = retrospective_checkbox;
    this.reconstructed_checkbox = reconstructed_checkbox;
  };
}

export class GravityController {
  readonly view: HTMLDivElement;
  readonly chord_checkbox: Checkbox;
  readonly scale_checkbox: Checkbox;
  constructor(
    visible: boolean
  ) {
    const chord_gravity_switcher = new Checkbox("chord_gravity_switcher", "Chord Gravity");
    const scale_gravity_switcher = new Checkbox("scale_gravity_switcher", "Scale Gravity");

    this.view = document.createElement("div");
    this.view.id = "gravity-switcher";
    this.view.style = visible ? "visible" : "hidden";
    this.view.appendChild(scale_gravity_switcher.body);
    this.view.appendChild(chord_gravity_switcher.body);
    this.chord_checkbox = chord_gravity_switcher;
    this.scale_checkbox = scale_gravity_switcher;
  };
}
