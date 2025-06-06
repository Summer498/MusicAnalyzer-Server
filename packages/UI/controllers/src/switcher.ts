import { Controller, createController } from "./controller";

export interface Checkbox {
  readonly body: HTMLSpanElement
  readonly input: HTMLInputElement
  addListeners(...listeners: ((e: boolean) => void)[]): void
}

export const createCheckbox = (id: string, label: string): Checkbox => {
  class CheckboxImpl extends Controller<boolean> {
    constructor() {
      super("checkbox", id, label)
      this.input.checked = false
    }
    update() {
      this.listeners.forEach(e => e(this.input.checked))
    }
  }
  return new CheckboxImpl()
}

export interface DMelodyController {
  readonly view: HTMLDivElement
  readonly checkbox: Checkbox
  addListeners(...listeners: ((e: boolean) => void)[]): void
}

export const createDMelodyController = (): DMelodyController => {
  const checkbox = createCheckbox("d_melody_switcher", "detected melody before fix")
  const view = document.createElement("div")
  view.id = "d-melody"
  view.appendChild(checkbox.body)
  return {
    view,
    checkbox,
    addListeners: (...ls: ((e: boolean) => void)[]) => checkbox.addListeners(...ls),
  }
}

export interface ImplicationDisplayController {
  readonly view: HTMLDivElement
  readonly prospective_checkbox: Checkbox
  readonly retrospective_checkbox: Checkbox
  readonly reconstructed_checkbox: Checkbox
}

export const createImplicationDisplayController = (): ImplicationDisplayController => {
  const prospective_checkbox = createCheckbox("prospective_checkbox", "prospective implication")
  const retrospective_checkbox = createCheckbox("retrospective_checkbox", "retrospective implication")
  const reconstructed_checkbox = createCheckbox("reconstructed_checkbox", "reconstructed implication")
  const view = document.createElement("div")
  view.id = "prospective-implication"
  view.appendChild(prospective_checkbox.body)
  view.appendChild(retrospective_checkbox.body)
  view.appendChild(reconstructed_checkbox.body)
  return {
    view,
    prospective_checkbox,
    retrospective_checkbox,
    reconstructed_checkbox,
  }
}

export interface GravityController {
  readonly view: HTMLDivElement
  readonly chord_checkbox: Checkbox
  readonly scale_checkbox: Checkbox
}

export const createGravityController = (visible: boolean): GravityController => {
  const chord_gravity_switcher = createCheckbox("chord_gravity_switcher", "Chord Gravity")
  const scale_gravity_switcher = createCheckbox("scale_gravity_switcher", "Scale Gravity")
  const view = document.createElement("div")
  view.id = "gravity-switcher"
  ;(view as any).style = visible ? "visible" : "hidden"
  view.appendChild(scale_gravity_switcher.body)
  view.appendChild(chord_gravity_switcher.body)
  return {
    view,
    chord_checkbox: chord_gravity_switcher,
    scale_checkbox: scale_gravity_switcher,
  }
}
