import { Controller } from "../controller";

export abstract class ColorSelector<T> extends Controller<T> {
  constructor(
    readonly id: string,
    text: string
  ) {
    super("radio", id, text);
  };
}
