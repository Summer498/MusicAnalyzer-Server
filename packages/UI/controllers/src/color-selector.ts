import { get_color_of_implication_realization } from "@music-analyzer/irm";
import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { get_color_on_digital_intervallic_scale } from "@music-analyzer/irm";
import { get_color_on_digital_parametric_scale } from "@music-analyzer/irm";
import { get_color_on_intervallic_angle } from "@music-analyzer/irm";
import { get_color_on_parametric_scale } from "@music-analyzer/irm";
import { get_color_on_registral_scale } from "@music-analyzer/irm";
import { Triad } from "@music-analyzer/irm";
import { Controller } from "./controller";


export type GetColor = (e: Triad) => string;
export type SetColor = (getColor: GetColor) => void;

abstract class ColorSelector<T> extends Controller<T> {
  constructor(
    readonly id: string,
    text: string
  ) {
    super("radio", id, text);
  };
}

class IRM_ColorSelector
  extends ColorSelector<GetColor> {
  getColor: GetColor;
  constructor(
    id: string,
    text: string,
    getColor: GetColor,
  ) {
    super(id, text);
    this.getColor = getColor
  }
  update() {
    this.listeners.forEach(setColor => setColor(triad => this.getColor(triad)));
  }
}

class MelodyColorSelector {
  readonly body: HTMLSpanElement;
  readonly children: IRM_ColorSelector[];
  readonly default: IRM_ColorSelector;
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

    this.default = this.children[0];
    this.default && (this.default.input.checked = true);

    this.body = document.createElement("div");
    this.body.id = "melody_color_selector";
    this.children.forEach(e => this.body.appendChild(e.body));
    this.default.update();
  }
  addListeners(...listeners: ((color: GetColor) => void)[]) {
    this.children.forEach(e => e.addListeners(...listeners))
    this.default.update()
  }
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
  }
  addListeners(...listeners: ((color: GetColor) => void)[]) {
    this.selector.addListeners(...listeners)
  }
}
