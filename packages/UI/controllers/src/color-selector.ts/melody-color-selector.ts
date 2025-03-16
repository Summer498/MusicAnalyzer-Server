import { get_color_of_implication_realization, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale, get_color_on_intervallic_angle, get_color_on_parametric_scale, get_color_on_registral_scale, Triad } from "@music-analyzer/irm";
import { IRM_ColorSelector } from "./irm-color-selector";

export interface hasArchetype { archetype: Triad }
export interface ColorChangeSubscriber {
  setColor: (getColor: (e: hasArchetype) => string) => void
  updateColor: () => void
}

export class MelodyColorSelector {
  readonly body: HTMLSpanElement;
  readonly children: IRM_ColorSelector[];
  constructor() {
    this.children = [
      new IRM_ColorSelector("Narmour_concept", "Narmour concept color", get_color_of_Narmour_concept),
      new IRM_ColorSelector("implication_realization", "implication realization", get_color_of_implication_realization),
      new IRM_ColorSelector("digital_parametric_scale", "digital parametric scale color", get_color_on_digital_parametric_scale),
      new IRM_ColorSelector("digital_intervallic_scale", "digital intervallic scale color", get_color_on_digital_intervallic_scale),
      new IRM_ColorSelector("registral_scale", "registral scale color", get_color_on_registral_scale),
      new IRM_ColorSelector("intervallic_angle", "intervallic angle color", get_color_on_intervallic_angle),
      new IRM_ColorSelector("analog_parametric_scale", "analog parametric scale color", get_color_on_parametric_scale),
    ];
    this.children.forEach(e => { e.input.name = "melody-color-selector"; });

    const default_item = this.children[0];
    default_item && (default_item.input.checked = true);

    this.body = document.createElement("div");
    this.body.id = "melody_color_selector";
    this.children.forEach(e => this.body.appendChild(e.body));
  }
  register(...subscribers: ColorChangeSubscriber[]) { this.children.forEach(e => e.register(...subscribers)) }
}
