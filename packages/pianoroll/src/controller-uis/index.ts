import { MelodyColorController, DMelodyController, DMelodySwitcher, GravityController, GravitySwitcher, HierarchyLevel, HierarchyLevelController, MelodyBeepController, MelodyBeepSwitcher, MelodyBeepVolume, MelodyColorSelector, TimeRangeController, TimeRangeSlider } from "@music-analyzer/controllers";

export class ControllerUIs {
  readonly scale_gravity_switcher: GravitySwitcher;
  readonly chord_gravity_switcher: GravitySwitcher;
  readonly d_melody_switcher: DMelodySwitcher;
  readonly melody_beep_switcher: MelodyBeepSwitcher;
  readonly melody_beep_volume: MelodyBeepVolume;
  readonly melody_color_selector: MelodyColorSelector;
  readonly hierarchy_level: HierarchyLevel;
  readonly time_range_slider: TimeRangeSlider;

  readonly gravity_controller: GravityController;
  readonly d_melody_controller: DMelodyController;
  readonly melody_beep_controller: MelodyBeepController;
  readonly melody_color_controller: MelodyColorController;
  readonly hierarchy_controller: HierarchyLevelController;
  readonly time_range_controller: TimeRangeController;


  constructor() {
    this.scale_gravity_switcher = new GravitySwitcher("scale_gravity_switcher", "Scale Gravity");
    this.chord_gravity_switcher = new GravitySwitcher("chord_gravity_switcher", "Chord Gravity");
    this.d_melody_switcher = new DMelodySwitcher("d_melody_switcher", "detected melody before fix");
    this.melody_beep_switcher = new MelodyBeepSwitcher("melody_beep_switcher", "Beep Melody");
    this.melody_beep_volume = new MelodyBeepVolume();
    this.melody_color_selector = new MelodyColorSelector();
    this.hierarchy_level = new HierarchyLevel();
    this.time_range_slider = new TimeRangeSlider();
    
    this.gravity_controller = new GravityController(this.scale_gravity_switcher, this.chord_gravity_switcher);
    this.d_melody_controller = new DMelodyController(this.d_melody_switcher);
    this.melody_beep_controller = new MelodyBeepController(this.melody_beep_switcher, this.melody_beep_volume);
    this.melody_color_controller = new MelodyColorController(this.melody_color_selector);
    this.hierarchy_controller = new HierarchyLevelController(this.hierarchy_level);
    this.time_range_controller = new TimeRangeController(this.time_range_slider);
  }
}
