import { AccompanyToAudioRegistry, SvgCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { PianoRollRatio } from "@music-analyzer/view-parameters";
import { Controller, HierarchyLevel, Slider, Switcher } from "@music-analyzer/controllers";
import { ChordGravityHierarchy, MelodyHierarchy, ScaleGravityHierarchy } from "@music-analyzer/melody-view";

abstract class ControllerMediator<Subscriber> {
  protected readonly controller: Controller;
  protected readonly subscribers: Subscriber[];
  constructor(controller: Controller, subscribers: Subscriber[]) {
    this.controller = controller;
    this.subscribers = subscribers;
    this.init(controller);
  }
  abstract update(): void
  protected init(controller: Controller) {
    controller.input.addEventListener("input", this.update.bind(this));
    this.update.bind(this)();
  };
}

abstract class SwitcherMediator<Subscriber> extends ControllerMediator<Subscriber> {
  constructor(controller: Controller, subscribers: Subscriber[]) {
    super(controller, subscribers);
  }
}

export class DMelodySwitcherMediator extends SwitcherMediator<SvgCollection> {
  constructor(
    switcher: Switcher,
    d_melody_collection: SvgCollection
  ) {
    super(switcher, [d_melody_collection]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}

export class ScaleGravitySwitcherMediator extends SwitcherMediator<ScaleGravityHierarchy> {
  constructor(
    switcher: Switcher,
    scale_gravities: ScaleGravityHierarchy
  ) {
    super(switcher, [scale_gravities]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}

export class ChordGravitySwitcherMediator extends SwitcherMediator<ChordGravityHierarchy> {
  constructor(
    switcher: Switcher,
    chord_gravities: ChordGravityHierarchy
  ) {
    super(switcher, [chord_gravities]);
  }
  override update() {
    const visibility = this.controller.input.checked ? "visible" : "hidden";
    this.subscribers.forEach(e => e.svg.style.visibility = visibility);
  }
}

export class MelodyBeepSwitcherMediator extends SwitcherMediator<MelodyHierarchy> {
  constructor(
    switcher: Switcher,
    melody_hierarchy: MelodyHierarchy,
  ) {
    switcher.input.checked = true;
    super(switcher, [melody_hierarchy]);
  }
  override update() {
    const visibility = this.controller.input.checked;
    this.subscribers.forEach(e => e.onMelodyBeepCheckChanged(visibility));
  };
}

abstract class SliderMediator<Subscriber> extends ControllerMediator<Subscriber> {
  constructor(controller: Controller, subscribers: Subscriber[]) {
    super(controller, subscribers);
  }
}

interface HierarchyLevelSubscriber {
  children: { length: number }
  onChangedLayer(value: number): void
}
export class HierarchyLevelSliderMediator extends SliderMediator<HierarchyLevelSubscriber> {
  constructor(
    slider: HierarchyLevel,
    ...subscribers: HierarchyLevelSubscriber[]
  ) {
    const max = Math.max(...subscribers.map(e => e.children.length - 1));
    slider.setHierarchyLevelSliderValues(max);
    super(slider, subscribers);
  }
  override update() {
    const value = Number(this.controller.input.value);
    this.subscribers.forEach(e => e.onChangedLayer(value));
  }
}

export class MelodyBeepVolumeMediator extends SliderMediator<MelodyHierarchy> {
  constructor(
    slider: Slider,
    melody_hierarchy: MelodyHierarchy,
  ) {
    super(slider, [melody_hierarchy]);
  }

  override update() {
    const value = Number(this.controller.input.value);
    this.subscribers.forEach(e => e.onMelodyVolumeBarChanged(value));
  }
}

export class TimeRangeSliderMediator extends SliderMediator<AccompanyToAudioRegistry> {
  constructor(
    slider: Slider,
    accompany_to_audio_registry: AccompanyToAudioRegistry,
  ) {
    super(slider, [accompany_to_audio_registry]);
  }

  override update() {
    const time_range = Number(this.controller.input.value);
    const time_range_max = Number(this.controller.input.max);
    const time_range_ratio = Math.pow(2, time_range - time_range_max);
    PianoRollRatio.value = time_range_ratio;
    this.subscribers.forEach(e => e.onAudioUpdate());
    WindowReflectableRegistry.instance.onWindowResized();
  }
}
