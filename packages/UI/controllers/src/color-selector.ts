import { get_color_of_implication_realization, ITriad } from "@music-analyzer/irm";
import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { get_color_on_digital_intervallic_scale } from "@music-analyzer/irm";
import { get_color_on_digital_parametric_scale } from "@music-analyzer/irm";
import { get_color_on_intervallic_angle } from "@music-analyzer/irm";
import { get_color_on_parametric_scale } from "@music-analyzer/irm";
import { get_color_on_registral_scale } from "@music-analyzer/irm";
import { Controller, createController } from "./controller";


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

class ColorSelectorImpl<T> extends Controller<T> implements ColorSelector<T> {
  constructor(id: string, text: string) {
  }
  update() { /* noop */ }
class IRM_ColorSelectorImpl
  extends ColorSelectorImpl<GetColor>
  implements IRM_ColorSelector {
    readonly getColor: GetColor,
  override update() {
class MelodyColorSelectorImpl implements MelodyColorSelector {
  readonly body: HTMLDivElement;
  readonly children: IRM_ColorSelectorImpl[];
  readonly default: IRM_ColorSelectorImpl;
      new IRM_ColorSelectorImpl("Narmour_concept", "Narmour concept color", get_color_of_Narmour_concept),
      new IRM_ColorSelectorImpl("implication_realization", "implication realization", get_color_of_implication_realization),
      new IRM_ColorSelectorImpl("digital_parametric_scale", "digital parametric scale color", get_color_on_digital_parametric_scale),
      new IRM_ColorSelectorImpl("digital_intervallic_scale", "digital intervallic scale color", get_color_on_digital_intervallic_scale),
      new IRM_ColorSelectorImpl("registral_scale", "registral scale color", get_color_on_registral_scale),
      new IRM_ColorSelectorImpl("intervallic_angle", "intervallic angle color", get_color_on_intervallic_angle),
      new IRM_ColorSelectorImpl("analog_parametric_scale", "analog parametric scale color", get_color_on_parametric_scale),
    this.children.forEach(e => e.addListeners(...listeners));
    this.default.update();
class MelodyColorControllerImpl implements MelodyColorController {
  readonly selector: MelodyColorSelectorImpl;
    this.selector = new MelodyColorSelectorImpl();
    this.selector.addListeners(...listeners);

export const createMelodyColorController = (): MelodyColorController =>
  new MelodyColorControllerImpl();

  extends ColorSelectorImpl<GetColor>
  implements IRM_ColorSelector {
  constructor(
    id: string,
    text: string,
    readonly getColor: GetColor,
  ) {
    super(id, text);
  }
  override update() {
    this.listeners.forEach(setColor => setColor(triad => this.getColor(triad)));
  }
}

class MelodyColorSelectorImpl implements MelodyColorSelector {
  readonly body: HTMLDivElement;
  readonly children: IRM_ColorSelectorImpl[];
  readonly default: IRM_ColorSelectorImpl;
  constructor() {
    this.children = [
      new IRM_ColorSelectorImpl("Narmour_concept", "Narmour concept color", get_color_of_Narmour_concept),
      new IRM_ColorSelectorImpl("implication_realization", "implication realization", get_color_of_implication_realization),
      new IRM_ColorSelectorImpl("digital_parametric_scale", "digital parametric scale color", get_color_on_digital_parametric_scale),
      new IRM_ColorSelectorImpl("digital_intervallic_scale", "digital intervallic scale color", get_color_on_digital_intervallic_scale),
      new IRM_ColorSelectorImpl("registral_scale", "registral scale color", get_color_on_registral_scale),
      new IRM_ColorSelectorImpl("intervallic_angle", "intervallic angle color", get_color_on_intervallic_angle),
      new IRM_ColorSelectorImpl("analog_parametric_scale", "analog parametric scale color", get_color_on_parametric_scale),
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
    this.children.forEach(e => e.addListeners(...listeners));
    this.default.update();
  }
}

class MelodyColorControllerImpl implements MelodyColorController {
  readonly view: HTMLDivElement;
  readonly selector: MelodyColorSelectorImpl;
  constructor() {
    this.selector = new MelodyColorSelectorImpl();
    this.view = document.createElement("div");
    this.view.id = "melody-color-selector";
    this.view.style.display = "inline";
    this.view.appendChild(this.selector.body);
  }
  addListeners(...listeners: ((color: GetColor) => void)[]) {
    this.selector.addListeners(...listeners);
  }
}

export const createMelodyColorController = (): MelodyColorController =>
  new MelodyColorControllerImpl();

