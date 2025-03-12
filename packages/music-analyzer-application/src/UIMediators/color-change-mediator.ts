import { ColorSelector, IRM_ColorNameIDs } from "@music-analyzer/controllers";
import { Archetype, Dyad, get_color_of_implication_realization, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale, get_color_on_intervallic_angle, get_color_on_parametric_scale, get_color_on_registral_scale, Monad, Null_ad, Triad } from "@music-analyzer/irm";
import { ControllerMediator } from "./controller-mediator";

type hasArchetype = { archetype: Archetype | Triad | Dyad | Monad | Null_ad }
type ColorChangeSubscriber = {
  setColor: (getColor: (e: hasArchetype) => string) => void
  updateColor: () => void
}
export class ColorChangeMediator extends ControllerMediator<ColorChangeSubscriber> {
  constructor(
    controllers: ColorSelector<IRM_ColorNameIDs>[],
    subscribers: ColorChangeSubscriber[]
  ) {
    super(controllers, subscribers);
    this.init(controllers);
  }
  protected init(controllers: ColorSelector<IRM_ColorNameIDs>[]) {
    controllers.forEach(s =>
      s.input.addEventListener("input",
        this._update.bind(this)((e: hasArchetype) => this.mapColor(s.id)(e.archetype)
        )
      )
    );
    this._update.bind(this)((e: hasArchetype) => this.mapColor("Narmour_concept")(e.archetype))();
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
  _update(getColor: (e: hasArchetype) => string) {
    return () => {
      this.subscribers.forEach(e => e.setColor(getColor));
    };
  }
  update() { }
}