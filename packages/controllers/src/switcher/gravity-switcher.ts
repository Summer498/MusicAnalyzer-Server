import { Switcher } from "./abstract-switcher";

export class GravitySwitcher extends Switcher {
  constructor(id: string, label: string) {
    super(id, label);
  };
}

export class GravityController {
  readonly view: HTMLDivElement;
  constructor(
    chord_gravity_switcher: GravitySwitcher,
    scale_gravity_switcher: GravitySwitcher,
  ) {
    this.view = document.createElement("div");
    this.view.id = "gravity-switcher";
    this.view.appendChild(scale_gravity_switcher.body);
    this.view.appendChild(chord_gravity_switcher.body);
  };
}
