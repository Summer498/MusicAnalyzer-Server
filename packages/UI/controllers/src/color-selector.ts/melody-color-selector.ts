import { ColorSelector } from "./color-selector";
import { IRM_ColorNameIDs } from "./IRM-color-names";

export class MelodyColorSelector {
  readonly body: HTMLSpanElement;
  readonly children: ColorSelector<IRM_ColorNameIDs>[];
  constructor() {
    this.children = [
      new ColorSelector("Narmour_concept", "Narmour concept color",),
      new ColorSelector("implication_realization", "implication realization",),
      new ColorSelector("digital_parametric_scale", "digital parametric scale color",),
      new ColorSelector("digital_intervallic_scale", "digital intervallic scale color",),
      new ColorSelector("registral_scale", "registral scale color",),
      new ColorSelector("intervallic_angle", "intervallic angle color",),
      new ColorSelector("analog_parametric_scale", "analog parametric scale color",),
    ];
    this.children.forEach(e => { e.input.name = "melody-color-selector"; });

    const default_item = this.children[0];
    default_item && (default_item.input.checked = true);

    this.body = document.createElement("div");
    this.body.id = "melody_color_selector";
    this.children.forEach(e => this.body.appendChild(e.body));
  }
  readonly subscribers: never[] = [];
}
