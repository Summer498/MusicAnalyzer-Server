import { ArrowModel } from "./arrow-model";
import { ArrowView } from "./arrow-view";


export class ArrowController {
  readonly model: ArrowModel;
  readonly view: ArrowView;

  constructor(
    model: ArrowModel,
  ) {
    this.model = model;
    this.view = new ArrowView(this.model);
  }
}
