export class ColorSelector<ID extends string> {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  body: HTMLSpanElement;
  constructor(
    readonly id: ID,
    text: string
  ) {
    this.input = document.createElement("input");
    this.input.id = this.id;
    this.input.type = "radio";
    this.input.value = this.id;

    this.label = document.createElement("label");
    this.label.textContent = text;
    this.label.htmlFor = this.input.id;
    this.label.style.whiteSpace = "nowrap";  //     white-space: nowrap;

    this.body = document.createElement("span");
    this.body.style.whiteSpace = "nowrap";   //     white-space: nowrap;
    this.body.appendChild(this.input);
    this.body.appendChild(this.label);
  };
}

export type MelodyColorIDs
  = "Narmour_concept"
  | "implication_realization"
  | "digital_intervallic_scale"
  | "digital_parametric_scale"
  | "intervallic_angle"
  | "registral_scale"
  | "analog_parametric_scale"

export class MelodyColorSelector {
  readonly body: HTMLSpanElement;
  readonly children: ColorSelector<MelodyColorIDs>[];
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
}
