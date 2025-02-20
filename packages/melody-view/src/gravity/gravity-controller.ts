import { MVCController } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";


export class GravityController extends MVCController{
  readonly model: GravityModel;
  readonly view: GravityView;

  constructor(
    model: GravityModel,
  ) {
    super();
    this.model = model;
    this.view = new GravityView(this.model);
  }
}
