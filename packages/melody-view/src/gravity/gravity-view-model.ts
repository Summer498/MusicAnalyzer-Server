import { MVVM_ViewModel } from "@music-analyzer/view";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";


export class GravityVM extends MVVM_ViewModel<GravityModel, GravityView> {
  constructor(model: GravityModel) {
    super(model, new GravityView(model));
  }
}
