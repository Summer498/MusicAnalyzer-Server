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
  body: HTMLSpanElement;
  input: HTMLInputElement;
  listeners: ((e: T) => void)[];
  addListeners: (...listeners: ((e: T) => void)[]) => void;
  update: () => void;
  init: () => void;
}

export interface ControllerView {
  body: HTMLSpanElement;
  input: HTMLInputElement;
  label: HTMLLabelElement;
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

  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  labelElement.htmlFor = input.id;
  labelElement.style.whiteSpace = "nowrap";

  const body = document.createElement("span");
  body.style.whiteSpace = "nowrap";
  body.appendChild(labelElement);
  body.appendChild(input);

  return { body, input, label: labelElement };
}

export function createController<T>(
  instance: { update: () => void } & Partial<Controller<T>>,
  type: HTMLInputElementType,
  id: string,
  label: string,
): Controller<T> {
  const view = createControllerView(type, id, label);
  const listeners: ((e: T) => void)[] = [];

  function addListeners(...ls: ((e: T) => void)[]) {
    listeners.push(...ls);
    instance.update();
  }

  function init() {
    view.input.addEventListener("input", instance.update.bind(instance));
    instance.update();
  }

  Object.assign(instance, view, { listeners, addListeners, init });
  init();
  return instance as Controller<T>;
}
