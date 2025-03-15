import { MelodyColorController, DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, TimeRangeController } from "@music-analyzer/controllers";

class ControllerUIs {
  readonly gravity: GravityController;
  readonly d_melody: DMelodyController;
  readonly melody_beep: MelodyBeepController;
  readonly melody_color: MelodyColorController;
  readonly hierarchy: HierarchyLevelController;
  readonly time_range: TimeRangeController;


  constructor() {
    this.gravity = new GravityController();
    this.d_melody = new DMelodyController();
    this.melody_beep = new MelodyBeepController();
    this.melody_color = new MelodyColorController();
    this.hierarchy = new HierarchyLevelController();
    this.time_range = new TimeRangeController();
  }
}
