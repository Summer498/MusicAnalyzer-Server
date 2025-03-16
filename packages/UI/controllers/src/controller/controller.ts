import { ControllerView } from "./controller-view";

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
  readonly subscribers: T[] = [];
  register(...subscribers: T[]) {
    this.subscribers.push(...subscribers);
    this.update()
  }
  abstract update(): void;
  init() {
    this.input.addEventListener("input", this.update.bind(this));
    this.update();
  };
}
