class ColorSelector<ID extends string> {
  #id: ID;
  selector: HTMLInputElement;
  label: HTMLLabelElement;
  body: HTMLSpanElement;
  constructor(id: ID, value: string, text: string) {
    this.#id = id;
    this.selector = document.createElement("input");
    this.selector.id = id;
    this.selector.type = "radio";
    this.selector.value = value;

    this.label = document.createElement("label");
    this.label.textContent = text;
    this.label.htmlFor = this.selector.id;
    this.label.style.whiteSpace = "nowrap";  //     white-space: nowrap;

    this.body = document.createElement("span");
    this.body.style.whiteSpace = "nowrap";   //     white-space: nowrap;
    this.body.appendChild(this.selector);
    this.body.appendChild(this.label);
  };
}

type MelodyColorIDs
  = "Narmour_concept"
  | "implication_realization"
  | "digital_intervallic_scale"
  | "digital_parametric_scale"
  | "intervallic_angle"
  | "registral_scale"
  | "analog_parametric_scale"

export class MelodyColorSelector {
  readonly body: HTMLSpanElement;
  constructor() {
    const selectors: ColorSelector<MelodyColorIDs>[] = [
      new ColorSelector("Narmour_concept", "Narmour", "Narmour concept color",),
      new ColorSelector("implication_realization", "implication_realization", "implication realization",),
      new ColorSelector("digital_parametric_scale", "digital_parametric_scale", "digital parametric scale color",),
      new ColorSelector("digital_intervallic_scale", "digital_intervallic_scale", "digital intervallic scale color",),
      new ColorSelector("registral_scale", "registral_scale", "registral scale color",),
      new ColorSelector("intervallic_angle", "intervallic_angle", "intervallic angle color",),
      new ColorSelector("analog_parametric_scale", "analog_parametric_scale", "analog parametric scale color",),
    ];
    selectors.forEach(e => { e.selector.name = "melody-color-selector"; });

    const default_item = selectors[0];
    default_item && (default_item.selector.checked = true);

    this.body = document.createElement("div");
    this.body.id = "melody_color_selector";
    selectors.forEach(e => this.body.appendChild(e.body));
  }
}

export class MelodyColorController {
  readonly view: HTMLDivElement;
  constructor() {
    const melody_color_selector = new MelodyColorSelector();
    this.view = document.createElement("div");
    this.view.id = "melody-color-selector";
    this.view.style.display = "inline";
    this.view.appendChild(melody_color_selector.body);
  }
}
