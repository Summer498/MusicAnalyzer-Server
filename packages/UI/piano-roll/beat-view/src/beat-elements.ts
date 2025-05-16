import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { NowAt, PianoRollConverter } from "@music-analyzer/view-parameters";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { reservation_range } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel_Impl } from "@music-analyzer/view";
import { play } from "@music-analyzer/synth";
import { MVVM_View_Impl } from "@music-analyzer/view";

export class BeatBarModel {
  readonly time: Time;
  constructor(beat_info: BeatInfo, i: number) {
    this.time = new Time(
      i * 60 / beat_info.tempo,
      (i + 1) * 60 / beat_info.tempo
    );
  }
}

export class BeatBarView 
  extends MVVM_View_Impl<"line"> {
  constructor(model: BeatBarModel) {
    super("line");
    this.svg.id = "bar";
    this.svg.style.stroke = "rgb(0, 0, 0)";
    this.svg.style.display = "none";  //NOTE: 一旦非表示にしている
  }
  updateX(x1: number, x2: number) {
    this.svg.setAttribute("x1", String(x1));
    this.svg.setAttribute("x2", String(x2));
  }
  updateY(y1: number, y2: number) {
    this.svg.setAttribute("y1", String(y1));
    this.svg.setAttribute("y2", String(y2));
  }
}

export class BeatBar
  extends MVVM_ViewModel_Impl<BeatBarModel, BeatBarView> {
  #y1: number;
  #y2: number;
  sound_reserved: boolean;
  constructor(
    beat_info: BeatInfo,
    i: number
  ) {
    const model = new BeatBarModel(beat_info, i);
    super(model, new BeatBarView(model));
    this.sound_reserved = false;
    this.#y1 = 0;
    this.#y2 = PianoRollHeight.get();
    this.updateX();
    this.updateY();
  }
  updateX() {
    this.view.updateX(
      PianoRollConverter.scaled(this.model.time.begin),
      PianoRollConverter.scaled(this.model.time.begin),
    )
  }
  updateY() {
    this.view.updateY(
      this.#y1,
      this.#y2,
    )
  }
  onWindowResized() {
    this.updateX();
  }
  onTimeRangeChanged = this.onWindowResized

  beepBeat() {
    const model_is_in_range = new Time(0, reservation_range)
      .map(e => e + NowAt.get())
      .has(this.model.time.begin);
    if (model_is_in_range) {
      if (this.sound_reserved === false) {
        play([220], this.model.time.begin - NowAt.get(), 0.125);
        this.sound_reserved = true;
        setTimeout(() => { this.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  }
  onAudioUpdate() {
    // NOTE: うるさいので停止中
    0 && this.beepBeat();
  }
}

export interface RequiredByBeatBarsSeries {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export class BeatBarsSeries
  extends ReflectableTimeAndMVCControllerCollection<BeatBar> {
  constructor(
    beat_info: BeatInfo,
    melodies: { time: Time }[],
    controllers: RequiredByBeatBarsSeries
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].time.end) + beat_info.phase;
    const seed = [...Array(N)];
    super("beat-bars", seed.map((_, i) => new BeatBar(beat_info, i)));
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

export interface RequiredByBeatElements {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export class BeatElements {
  readonly children: BeatBarsSeries[];
  readonly beat_bars: BeatBarsSeries;
  constructor(
    beat_info: BeatInfo,
    melodies: { time: Time }[],
    controllers: RequiredByBeatElements
  ) {
    this.beat_bars = new BeatBarsSeries(beat_info, melodies, controllers);
    this.children = [this.beat_bars];
  }
}
