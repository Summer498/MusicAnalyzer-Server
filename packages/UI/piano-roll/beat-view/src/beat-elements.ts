import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time, createTime } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { NowAt, PianoRollConverter } from "@music-analyzer/view-parameters";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { reservation_range } from "@music-analyzer/view-parameters";
import { play } from "@music-analyzer/synth";

export class BeatBarModel {
  readonly time: Time;
  constructor(beat_info: BeatInfo, i: number) {
    this.time = createTime(
      i * 60 / beat_info.tempo,
      (i + 1) * 60 / beat_info.tempo
    );
  }
}

export class BeatBarView {
  constructor(
    readonly svg: SVGLineElement,
  ) { }
  updateX(x1: number, x2: number) {
    this.svg.setAttribute("x1", String(x1));
    this.svg.setAttribute("x2", String(x2));
  }
  updateY(y1: number, y2: number) {
    this.svg.setAttribute("y1", String(y1));
    this.svg.setAttribute("y2", String(y2));
  }
}

export class BeatBar {
  get svg() { return this.view.svg; }
  #y1: number;
  #y2: number;
  sound_reserved: boolean;
  constructor(
    readonly model: BeatBarModel,
    readonly view: BeatBarView,
  ) {
    this.model = model;
    this.view = view;
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
    const model_is_in_range = createTime(0, reservation_range)
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

export class BeatBarsSeries {
  readonly children_model: { readonly time: Time }[];
  #show: BeatBar[];
  get show() { return this.#show; };
  readonly svg: SVGGElement;

  constructor(
    readonly children: BeatBar[]
  ) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "beat-bars";
    children.forEach(e => svg.appendChild(e.svg));

    this.svg = svg;
    this.children_model = children.map(e => e.model);
    this.#show = children;
  }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}

export interface RequiredByBeatElements {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export class BeatElements {
  readonly children: BeatBarsSeries[];
  readonly beat_bars: SVGGElement;
  constructor(
    beat_info: BeatInfo,
    melodies: { time: Time }[],
    controllers: RequiredByBeatElements
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].time.end) + beat_info.phase;
    const seed = [...Array(N)];

    const beat_bar = seed.map((_, i) => {
      const model = new BeatBarModel(beat_info, i);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
      svg.id = "bar";
      svg.style.stroke = "rgb(0, 0, 0)";
      svg.style.display = "none";  //NOTE: 一旦非表示にしている

      const view = new BeatBarView(svg);
      return new BeatBar(model, view)
    })

    const beat_bars = new BeatBarsSeries(beat_bar);
    beat_bars.children
      .map(e => e.onAudioUpdate.bind(e))
      .map(f => controllers.audio.addListeners(f))
    beat_bars.children
      .map(e => e.onWindowResized.bind(e))
      .map(f => controllers.window.addListeners(f))
    const listeners = beat_bars.children.map(e => e.onTimeRangeChanged.bind(e))
    controllers.time_range.addListeners(...listeners)
    this.beat_bars = beat_bars.svg
    this.children = [beat_bars];
  }
}
