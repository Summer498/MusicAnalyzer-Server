import { ColorSelector } from "./color-selector";
import { get_color_of_implication_realization, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale, get_color_on_intervallic_angle, get_color_on_parametric_scale, get_color_on_registral_scale, Triad } from "@music-analyzer/irm";
import { IRM_ColorNameIDs } from "./IRM-color-names";

export interface hasArchetype { archetype: Triad }
export interface ColorChangeSubscriber {
  setColor: (getColor: (e: hasArchetype) => string) => void
  updateColor: () => void
}

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
    this.children.forEach(s =>
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
