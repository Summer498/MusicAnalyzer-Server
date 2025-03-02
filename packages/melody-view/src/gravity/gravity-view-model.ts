import { MVVM_ViewModel } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";


export class GravityVM extends MVVM_ViewModel{
  readonly view: GravityView;
  constructor(
    readonly model: GravityModel,
  ) {
    super();
    this.view = new GravityView(this.model);
  }
}
