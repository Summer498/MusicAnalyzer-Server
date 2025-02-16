import { HierarchyLevel, MelodyBeepVolume, MelodyColorSelector, Switcher, TimeRangeSlider } from "@music-analyzer/controllers";

export class ControllerUIs {
  readonly d_melody_switcher: Switcher;
  readonly hierarchy_level: HierarchyLevel;
  readonly time_range_slider: TimeRangeSlider;
  readonly scale_gravity_switcher: Switcher;
  readonly chord_gravity_switcher: Switcher;
  readonly melody_beep_switcher: Switcher;
  readonly melody_beep_volume: MelodyBeepVolume;
  readonly melody_color_selector: MelodyColorSelector;

  constructor(){
    this.d_melody_switcher = new Switcher("d_melody_switcher", "detected melody before fix");
    this.scale_gravity_switcher = new Switcher("scale_gravity_switcher", "Scale Gravity");
    this.chord_gravity_switcher = new Switcher("chord_gravity_switcher", "Chord Gravity");
    this.melody_beep_switcher = new Switcher("melody_beep_switcher", "Beep Melody");
    this.hierarchy_level = new HierarchyLevel();
    this.time_range_slider = new TimeRangeSlider();
    this.melody_beep_volume = new MelodyBeepVolume();
    this.melody_color_selector = new MelodyColorSelector();
  }
}
