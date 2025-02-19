import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";


export class GravityController {
  readonly model: GravityModel;
  readonly view: GravityView;

  constructor(
    model: GravityModel,
  ) {
    this.model = model;
    this.view = new GravityView(this.model);
  }
}
