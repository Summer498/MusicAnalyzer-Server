import { Checkbox } from "./abstract-switcher";

export class GravitySwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
  };
}

export class GravityController {
  readonly view: HTMLDivElement;
  readonly chord_checkbox: GravitySwitcher;
  readonly scale_checkbox: GravitySwitcher;
  constructor(
  ) {
    const chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity");
    const scale_gravity_switcher = new GravitySwitcher("scale_gravity_switcher", "Scale Gravity");

    this.view = document.createElement("div");
    this.view.id = "gravity-switcher";
    this.view.appendChild(scale_gravity_switcher.body);
    this.view.appendChild(chord_gravity_switcher.body);
    this.chord_checkbox = chord_gravity_switcher;
    this.scale_checkbox = scale_gravity_switcher;
  };
}
