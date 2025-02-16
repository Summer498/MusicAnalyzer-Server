export class MelodyColorSelector {
  readonly body: HTMLSpanElement;
  constructor() {
    const key_color_selector = document.createElement("input");
    key_color_selector.id = "key_color_selector";
    key_color_selector.name = "key_color_selector";
    key_color_selector.type = "radio";
    key_color_selector.value = "key";
    key_color_selector.checked = true;
    key_color_selector.textContent = "key based color";
    const chord_color_selector = document.createElement("input");
    chord_color_selector.id = "chord_color_selector";
    chord_color_selector.type = "radio";
    chord_color_selector.name = "chord_color_selector";
    chord_color_selector.value = "chord";
    chord_color_selector.textContent = "chord based color";
    const key_color_label = document.createElement("label");
    key_color_label.textContent = "key based color";
    key_color_label.htmlFor = key_color_selector.id;
    const chord_color_label = document.createElement("label");
    chord_color_label.textContent = "chord based color";
    chord_color_label.htmlFor = chord_color_selector.id;
    this.body = document.createElement("span");
    this.body.id = "melody_color_selector";
    this.body.appendChild(key_color_label);
    this.body.appendChild(key_color_selector);
    this.body.appendChild(chord_color_label);
    this.body.appendChild(chord_color_selector);
  }
}
