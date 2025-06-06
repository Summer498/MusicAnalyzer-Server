import { get_color_of_implication_realization, ITriad } from "@music-analyzer/irm";
import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { get_color_on_digital_intervallic_scale } from "@music-analyzer/irm";
import { get_color_on_digital_parametric_scale } from "@music-analyzer/irm";
import { get_color_on_intervallic_angle } from "@music-analyzer/irm";
import { get_color_on_parametric_scale } from "@music-analyzer/irm";
import { get_color_on_registral_scale } from "@music-analyzer/irm";
import { createControllerView } from "./controller";


export type GetColor = (e: ITriad) => string;
export type SetColor = (getColor: GetColor) => void;

export interface ColorSelector<T> {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  addListeners(...listeners: ((e: T) => void)[]): void;
}

export interface IRM_ColorSelector extends ColorSelector<GetColor> {
  readonly getColor: GetColor;
}

export interface MelodyColorSelector {
  readonly body: HTMLDivElement;
  addListeners(...listeners: ((color: GetColor) => void)[]): void;
}

export interface MelodyColorController {
  readonly view: HTMLDivElement;
  readonly selector: MelodyColorSelector;
  addListeners(...listeners: ((color: GetColor) => void)[]): void;
}

const createColorSelector = <T>(
  id: string,
  text: string,
  onUpdate: (listeners: ((e: T) => void)[], input: HTMLInputElement) => void,
): ColorSelector<T> => {
  const { body, input } = createControllerView("radio", id, text);
  const listeners: ((e: T) => void)[] = [];
  const update = () => onUpdate(listeners, input);
  input.addEventListener("input", update);
  update();
  return {
    body,
    input,
    addListeners: (...ls: ((e: T) => void)[]) => {
      listeners.push(...ls);
      update();
    },
  };
};

const createIRMColorSelector = (
  id: string,
  text: string,
  getColor: GetColor,
): IRM_ColorSelector => {
  const selector = createColorSelector<GetColor>(id, text, (ls, _input) => {
    ls.forEach(setColor => setColor(triad => getColor(triad)));
  });
  return { ...selector, getColor };
};

const createMelodyColorSelector = (): MelodyColorSelector => {
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

  const body = document.createElement("div");
  body.id = "melody_color_selector";
  children.forEach(e => body.appendChild(e.body));
  if (children[0]) children[0].input.checked = true;

  return {
    body,
    addListeners: (...listeners: ((color: GetColor) => void)[]) => {
      children.forEach(c => c.addListeners(...listeners));
    },
  };
};

export const createMelodyColorController = (): MelodyColorController => {
  const selector = createMelodyColorSelector();
  const view = document.createElement("div");
  view.id = "melody-color-selector";
  view.style.display = "inline";
  view.appendChild(selector.body);
  return {
    view,
    selector,
    addListeners: (...ls: ((color: GetColor) => void)[]) => selector.addListeners(...ls),
  };
};

