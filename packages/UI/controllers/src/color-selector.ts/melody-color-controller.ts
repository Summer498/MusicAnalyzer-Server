import { MelodyColorSelector } from "./melody-color-selector";
import { get_color_of_implication_realization, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale, get_color_on_intervallic_angle, get_color_on_parametric_scale, get_color_on_registral_scale, Triad } from "@music-analyzer/irm";
import { IRM_ColorNameIDs } from "./IRM-color-names";

export interface hasArchetype { archetype: Triad }
export interface ColorChangeSubscriber {
  setColor: (getColor: (e: hasArchetype) => string) => void
  updateColor: () => void
}

export class MelodyColorController {
  readonly view: HTMLDivElement;
  readonly selector: MelodyColorSelector;
  constructor() {
    this.selector = new MelodyColorSelector();
    this.view = document.createElement("div");
    this.view.id = "melody-color-selector";
    this.view.style.display = "inline";
    this.view.appendChild(this.selector.body);
    this.init()
  }
  readonly subscribers: ColorChangeSubscriber[] = [];
  register(...subscribers: ColorChangeSubscriber[]) {
    this.subscribers.push(...subscribers);
    this.update.bind(this)((e: hasArchetype) => this.mapColor("Narmour_concept")(e.archetype))();
  }
  update(getColor: (e: hasArchetype) => string) {
    return () => {
      this.subscribers.forEach(e => e.setColor(getColor));
    };
  }
  init() {
    this.selector.children.forEach(s =>
      s.input.addEventListener("input",
        this.update.bind(this)((e: hasArchetype) => this.mapColor(s.id)(e.archetype)
        )
      )
    );
    this.update.bind(this)((e: hasArchetype) => this.mapColor("Narmour_concept")(e.archetype))();
  };
  mapColor(id: IRM_ColorNameIDs) {
    switch (id) {
      case "Narmour_concept": return get_color_of_Narmour_concept;
      case "analog_parametric_scale": return get_color_on_parametric_scale;
      case "implication_realization": return get_color_of_implication_realization;
      case "digital_parametric_scale": return get_color_on_digital_parametric_scale;
      case "digital_intervallic_scale": return get_color_on_digital_intervallic_scale;
      case "intervallic_angle": return get_color_on_intervallic_angle;
      case "registral_scale": return get_color_on_registral_scale;
    }
  };
}
