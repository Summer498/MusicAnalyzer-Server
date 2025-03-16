import { ControllerView } from "./controller-view";

type HTMLInputElementType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export abstract class Controller {
  readonly body: HTMLSpanElement;
  readonly input: HTMLInputElement;
  readonly subscribers: never[]
  constructor(
    type: HTMLInputElementType,
    id: string,
    label: string,
  ) {
    const e = new ControllerView(type, id, label);
    this.body = e.body;
    this.input = e.input
    this.subscribers = [];
  }
  register(...subscribers: never[]) {
    this.subscribers.push(...subscribers);
  }
}
