import { MVCController } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";


export class GravityController extends MVCController{
  readonly view: GravityView;
  constructor(
    readonly model: GravityModel,
  ) {
    super();
    this.view = new GravityView(this.model);
  }
}
