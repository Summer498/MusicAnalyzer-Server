import { ColorSelector, IRM_ColorNameIDs } from "@music-analyzer/controllers";
import { Archetype, get_color_of_implication_realization, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale, get_color_on_intervallic_angle, get_color_on_parametric_scale, get_color_on_registral_scale } from "@music-analyzer/irm";

type ColorChangeSubscriber = {
  setColor: (getColor: (archetype: Archetype) => string) => void
  updateColor: () => void
}
export class ColorChangeMediator /*extends ControllerMediator<ColorChangeSubscriber>*/ {
  constructor(
    readonly controllers: ColorSelector<IRM_ColorNameIDs>[],
    readonly subscribers: ColorChangeSubscriber[]
  ) {
    this.init(controllers);
  }
  protected init(controllers: ColorSelector<IRM_ColorNameIDs>[]) {
    controllers.forEach(e => e.input.addEventListener("input", this.update.bind(this)(this.mapColor(e.id))));
    this.update.bind(this)(this.mapColor("Narmour_concept"))();
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
  update(getColor: (archetype: Archetype) => string) {
    return () => {
      this.subscribers.forEach(e => e.setColor(getColor));
    };
  }
}