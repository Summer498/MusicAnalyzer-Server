type HTMLInputElementType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export abstract class Controller<T> {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  constructor(
    type: HTMLInputElementType,
    id: string,
    label: string,
  ) {
    const e = new ControllerView(type, id, label);
    this.body = e.body;
    this.input = e.input
    this.init()
  }
  protected readonly listeners: ((e:T) => void)[] = []
  addListeners(...listeners: ((e:T) => void)[]) {
    this.listeners.push(...listeners);
    this.update();
  }
  abstract update(): void;
  init() {
    this.input.addEventListener("input", this.update.bind(this));
    this.update();
  };
}

export class ControllerView {
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
    this.label.style.whiteSpace = "nowrap";

    this.body = document.createElement("span");
    this.body.style.whiteSpace = "nowrap";
    this.body.appendChild(this.label);
    this.body.appendChild(this.input);
  }
}
