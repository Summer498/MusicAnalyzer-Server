import { get_color_of_implication_realization, ITriad } from "@music-analyzer/irm";
import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { get_color_on_digital_intervallic_scale } from "@music-analyzer/irm";
import { get_color_on_digital_parametric_scale } from "@music-analyzer/irm";
import { get_color_on_intervallic_angle } from "@music-analyzer/irm";
import { get_color_on_parametric_scale } from "@music-analyzer/irm";
import { get_color_on_registral_scale } from "@music-analyzer/irm";
import { Controller } from "./controller";


export type GetColor = (e: ITriad) => string;
export type SetColor = (getColor: GetColor) => void;

export interface ColorSelector<T> {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  addListeners(...listeners: ((e: T) => void)[]): void;
}

export interface IRM_ColorSelector extends ColorSelector<GetColor> {}

export interface MelodyColorSelector {
  readonly body: HTMLDivElement;
  addListeners(...listeners: ((color: GetColor) => void)[]): void;
}

export interface MelodyColorController {
  readonly view: HTMLDivElement;
  addListeners(...listeners: ((color: GetColor) => void)[]): void;
}

function createIRMColorSelector(
  id: string,
  text: string,
  getColor: GetColor,
): IRM_ColorSelector {
  class Impl extends Controller<GetColor> implements IRM_ColorSelector {
    constructor() { super("radio", id, text); }
    update() {
      this.listeners.forEach(setColor => setColor(triad => getColor(triad)));
    }
  }
  return new Impl();
}

export function createMelodyColorSelector(): MelodyColorSelector {
  const children: IRM_ColorSelector[] = [
    createIRMColorSelector("Narmour_concept", "Narmour concept color", get_color_of_Narmour_concept),
    createIRMColorSelector("implication_realization", "implication realization", get_color_of_implication_realization),
    createIRMColorSelector("digital_parametric_scale", "digital parametric scale color", get_color_on_digital_parametric_scale),
    createIRMColorSelector("digital_intervallic_scale", "digital intervallic scale color", get_color_on_digital_intervallic_scale),
    createIRMColorSelector("registral_scale", "registral scale color", get_color_on_registral_scale),
    createIRMColorSelector("intervallic_angle", "intervallic angle color", get_color_on_intervallic_angle),
    createIRMColorSelector("analog_parametric_scale", "analog parametric scale color", get_color_on_parametric_scale),
  ];
  children.forEach(e => { e.input.name = "melody-color-selector"; });

  const defaultSelector = children[0];
  defaultSelector.input.checked = true;

  const body = document.createElement("div");
  body.id = "melody_color_selector";
  children.forEach(e => body.appendChild(e.body));
  defaultSelector.update();

  return {
    body,
    addListeners: (...listeners: ((color: GetColor) => void)[]) => {
      children.forEach(e => e.addListeners(...listeners));
      defaultSelector.update();
    },
  };
}

export function createMelodyColorController(): MelodyColorController {
  const selector = createMelodyColorSelector();
  const view = document.createElement("div");
  view.id = "melody-color-selector";
  view.style.display = "inline";
  view.appendChild(selector.body);
  return {
    view,
    addListeners: (...listeners: ((color: GetColor) => void)[]) => {
      selector.addListeners(...listeners);
    },
  };
}
