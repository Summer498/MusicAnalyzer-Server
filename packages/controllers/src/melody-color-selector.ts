const getColorSelector = (id: string, value: string, text: string) => {
  const selector = document.createElement("input");
  selector.id = id;
  selector.name = id;
  selector.type = "radio";
  selector.value = value;

  const label = document.createElement("label");
  label.textContent = text;
  label.htmlFor = selector.id;
  label.style.whiteSpace = "nowrap";  //     white-space: nowrap;

  const span = document.createElement("span");
  span.style.whiteSpace = "nowrap";   //     white-space: nowrap;
  span.appendChild(selector);
  span.appendChild(label);
  return span;
};

export class MelodyColorSelector {
  readonly body: HTMLSpanElement;
  constructor() {
    const selectors = [
      getColorSelector("Narmour_concept", "Narmour", "Narmour concept color",),
      getColorSelector("digital_parametric_scale", "digital_parametric_scale", "digital parametric scale color",),
      getColorSelector("digital_intervallic_scale", "digital_intervallic_scale", "digital intervallic scale color",),
      getColorSelector("registral_scale", "registral_scale", "registral scale color",),
      getColorSelector("intervallic_angle", "intervallic_angle", "intervallic angle color",),
      getColorSelector("analog_parametric_scale", "analog_parametric_scale", "analog parametric scale color",),
    ];

    const default_item = selectors[0].getElementsByTagName("input").item(0);
    default_item && (default_item.checked = true);

    this.body = document.createElement("div");
    this.body.id = "melody_color_selector";
    selectors.forEach(e => this.body.appendChild(e));
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
