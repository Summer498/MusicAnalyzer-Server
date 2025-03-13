type HTMLInputElementType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export abstract class Controller {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  readonly label: HTMLLabelElement;

  constructor(
    type: HTMLInputElementType,
    id: string,
    label: string,
  ) {
    this.input = document.createElement("input");
    this.input.type = type;
    this.input.id = id;
    this.input.name = id;
    this.label = document.createElement("label");
    this.label.textContent = label;
    this.label.htmlFor = this.input.id;
    this.body = document.createElement("span");
    this.body.appendChild(this.label);
    this.body.appendChild(this.input);
  }
}
