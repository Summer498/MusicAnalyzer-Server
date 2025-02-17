import { MelodyColorController, DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, TimeRangeController } from "@music-analyzer/controllers";

export class ControllerUIs {
  readonly gravity_controller: GravityController;
  readonly d_melody_controller: DMelodyController;
  readonly melody_beep_controller: MelodyBeepController;
  readonly melody_color_controller: MelodyColorController;
  readonly hierarchy_controller: HierarchyLevelController;
  readonly time_range_controller: TimeRangeController;


  constructor() {
    this.gravity_controller = new GravityController();
    this.d_melody_controller = new DMelodyController();
    this.melody_beep_controller = new MelodyBeepController();
    this.melody_color_controller = new MelodyColorController();
    this.hierarchy_controller = new HierarchyLevelController();
    this.time_range_controller = new TimeRangeController();
  }
}
