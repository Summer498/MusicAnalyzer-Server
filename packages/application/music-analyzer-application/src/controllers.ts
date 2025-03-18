import { MelodyColorController, DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, TimeRangeController } from "@music-analyzer/controllers";

export class Controllers {
  readonly div: HTMLDivElement
  readonly d_melody: DMelodyController
  readonly hierarchy: HierarchyLevelController
  readonly time_range: TimeRangeController
  readonly gravity: GravityController
  readonly melody_beep: MelodyBeepController
  readonly melody_color: MelodyColorController

  constructor(
    layer_count: number,
    length: number,
    gravity_visible: boolean,
  ) {
    this.div = document.createElement("div");
    this.div.id = "controllers";
    this.div.style = "margin-top:20px";

    this.d_melody = new DMelodyController();
    this.hierarchy = new HierarchyLevelController(layer_count);
    this.time_range = new TimeRangeController(length);
    this.gravity = new GravityController(gravity_visible);
    this.melody_beep = new MelodyBeepController();
    this.melody_color = new MelodyColorController();


    [
      this.d_melody,
      this.hierarchy,
      this.time_range,
      this.gravity,
      this.melody_beep,
      this.melody_color,
    ].forEach(e => this.div.appendChild(e.view))
  }
}
