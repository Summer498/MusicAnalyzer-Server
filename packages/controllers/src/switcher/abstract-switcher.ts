import { Controller } from "../controller";

export class Switcher extends Controller {
  constructor(id: string, label: string) {
    super("checkbox", id, label);

    this.input.checked = false;
  }
}