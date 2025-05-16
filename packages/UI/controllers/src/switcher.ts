import { Controller } from "./controller";

export abstract class Checkbox<T> extends Controller<T> {
  constructor(id: string, label: string) {
    super("checkbox", id, label);

    this.input.checked = false;
  }
}

export class DMelodyController {
  readonly view: HTMLDivElement;
  readonly checkbox: DMelodySwitcher;
  constructor() {
    const d_melody_switcher = new DMelodySwitcher("d_melody_switcher", "detected melody before fix");
    this.view = document.createElement("div");
    this.view.id = "d-melody";
    this.view.appendChild(d_melody_switcher.body);
    this.checkbox = d_melody_switcher;
  };
  addListeners(...listeners: ((e:boolean) => void)[]) { this.checkbox.addListeners(...listeners); }
}

export class DMelodySwitcher 
  extends Checkbox<boolean> {
  constructor(id: string, label: string) {
    super(id, label);
  }
  update() {
    this.listeners.forEach(e=>e(this.input.checked))
  }
}

export class GravityController {
  readonly view: HTMLDivElement;
  readonly chord_checkbox: GravitySwitcher;
  readonly scale_checkbox: GravitySwitcher;
  constructor(
    visible: boolean
  ) {
    const chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity");
    const scale_gravity_switcher = new GravitySwitcher("scale_gravity_switcher", "Scale Gravity");

    this.view = document.createElement("div");
    this.view.id = "gravity-switcher";
    this.view.style = visible ? "visible" : "hidden";
    this.view.appendChild(scale_gravity_switcher.body);
    this.view.appendChild(chord_gravity_switcher.body);
    this.chord_checkbox = chord_gravity_switcher;
    this.scale_checkbox = scale_gravity_switcher;
  };
}

export class GravitySwitcher 
  extends Checkbox<boolean> {
  constructor(id: string, label: string) {
    super(id, label);
  };
  update() {
    this.listeners.forEach(e=>e(this.input.checked))
  }
}
