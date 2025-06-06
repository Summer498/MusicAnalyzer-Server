type HTMLInputElementType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export interface Controller<T> {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  readonly listeners: ((e: T) => void)[];
  addListeners(...listeners: ((e: T) => void)[]): void;
  update(): void;
}

export interface ControllerView {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  readonly label: HTMLLabelElement;
}

export function createControllerView(
  type: HTMLInputElementType,
  id: string,
  label: string,
): ControllerView {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.name = id;

  const labelEl = document.createElement("label");
  labelEl.textContent = label;
  labelEl.htmlFor = input.id;
  labelEl.style.whiteSpace = "nowrap";

  const body = document.createElement("span");
  body.style.whiteSpace = "nowrap";
  body.appendChild(labelEl);
  body.appendChild(input);

  return { body, input, label: labelEl };
}

export function createController<T>(
  type: HTMLInputElementType,
  id: string,
  label: string,
): Controller<T> {
  const view = createControllerView(type, id, label);
  const controller: Controller<T> = {
    body: view.body,
    input: view.input,
    listeners: [],
    addListeners(...listeners: ((e: T) => void)[]) {
      controller.listeners.push(...listeners);
      controller.update();
    },
    update() {},
  };

  controller.input.addEventListener("input", () => controller.update());
  controller.update();

  return controller;
}
