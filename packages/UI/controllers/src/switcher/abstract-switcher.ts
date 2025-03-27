import { Controller } from "../controller/controller";

export abstract class Checkbox<T> extends Controller<T> {
  constructor(id: string, label: string) {
    super("checkbox", id, label);

    this.input.checked = false;
  }
}