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
