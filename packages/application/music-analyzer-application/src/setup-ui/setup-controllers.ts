import { MelodyColorController, DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, TimeRangeController } from "@music-analyzer/controllers";

class ControllerUIs {
  constructor(
    readonly gravity: GravityController,
    readonly d_melody: DMelodyController,
    readonly melody_beep: MelodyBeepController,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
    readonly time_range: TimeRangeController,
  ) {  }
}

export class Controllers {
  readonly div: HTMLDivElement;
  readonly children: ControllerUIs;
  constructor(
    NO_CHORD: boolean
  ) {
    this.children = new ControllerUIs(
      new GravityController(),
      new DMelodyController(),
      new MelodyBeepController(),
      new MelodyColorController(),
      new HierarchyLevelController(),
      new TimeRangeController(),
    );

    const {
      d_melody,
      hierarchy,
      time_range,
      gravity,
      melody_beep,
      melody_color
    } = this.children;

    this.div = document.createElement("div");
    this.div.id = "controllers";
    this.div.style = "margin-top:20px";
    this.div.appendChild(d_melody.view);
    this.div.appendChild(hierarchy.view);
    this.div.appendChild(time_range.view);
    if (!NO_CHORD) {
      this.div.appendChild(gravity.view);
    }
    this.div.appendChild(melody_beep.view);
    this.div.appendChild(melody_color.view);  // NOTE: 色選択は未実装なので消しておく
  }
}