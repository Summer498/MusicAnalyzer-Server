import { deleteMelody } from "./melody-editor/delete";
import { Triad } from "@music-analyzer/irm";
import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { play } from "@music-analyzer/synth";
import { black_key_height, NowAt, PianoRollConverter } from "@music-analyzer/view-parameters";
import { reservation_range } from "@music-analyzer/view-parameters";
import { HierarchyLevelController, MelodyBeepController, MelodyColorController, SetColor, TimeRangeController } from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";

class MelodyBeep {
  #beep_volume: number;
  #do_melody_beep: boolean;
  #sound_reserved: boolean;
  constructor(
    private readonly model: MelodyModel,
  ) {
    this.#beep_volume = 0;
    this.#do_melody_beep = false;
    this.#sound_reserved = false;
  }
  #beepMelody = () => {
    const volume = this.#beep_volume / 400;
    const pitch = [440 * Math.pow(2, (this.model.note - 69) / 12)];
    const begin_sec = this.model.time.begin - NowAt.get();
    const length_sec = this.model.time.duration;
    play(pitch, begin_sec, length_sec, volume);
    this.#sound_reserved = true;
    setTimeout(() => { this.#sound_reserved = false; }, reservation_range * 1000);
  };
  beepMelody = () => {
    if (!this.#do_melody_beep) { return; }
    if (!this.model.note) { return; }
    const model_is_in_range =
      new Time(0, reservation_range)
        .map(e => e + NowAt.get())
        .has(this.model.time.begin)
    if (model_is_in_range) {
      if (this.#sound_reserved === false) { this.#beepMelody(); }
    }
  };
  onMelodyBeepCheckChanged(do_melody_beep: boolean) { this.#do_melody_beep = do_melody_beep; }
  onMelodyVolumeBarChanged(beep_volume: number) { this.#beep_volume = beep_volume; }
}

class MelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly melody_analysis: SerializedMelodyAnalysis;
  readonly archetype: Triad;
  constructor(e: SerializedTimeAndAnalyzedMelody) {
    this.time = e.time;
    this.head = e.head;
    this.note = e.note;
    this.melody_analysis = e.melody_analysis;
    this.archetype = e.melody_analysis.implication_realization as Triad;
  }
}

class MelodyView {
  constructor(
    readonly svg: SVGRectElement
  ) { }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
  readonly setColor = (color: string) => this.svg.style.fill = "#0d0";
}

class Melody {
  #beeper: MelodyBeep
  get svg() { return this.view.svg; }
  constructor(
    readonly model: MelodyModel,
    readonly view: MelodyView,
  ) {
    this.#beeper = new MelodyBeep(model);
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.view.updateX(PianoRollConverter.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(PianoRollConverter.midi2NNBlackCoordinate(this.model.note)); }
  updateWidth() { this.view.updateWidth(31 / 32 * PianoRollConverter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(black_key_height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
  }
  readonly setColor: SetColor = f => this.view.setColor(f(this.model.archetype))
  onTimeRangeChanged = this.onWindowResized;
  beep() { this.#beeper.beepMelody(); }
  onMelodyBeepCheckChanged(e: boolean) { this.#beeper.onMelodyBeepCheckChanged(e); }
  onMelodyVolumeBarChanged(e: number) { this.#beeper.onMelodyVolumeBarChanged(e); }
}

class MelodyLayer {
  readonly children_model: { readonly time: Time }[];
  #show: Melody[];
  get show() { return this.#show; };
  constructor(
    readonly svg: SVGGElement,
    readonly children: Melody[],
    readonly layer: number,
  ) {
    this.children_model = this.children.map(e => e.model);
    this.#show = children;
  }
  beep() { this.children.forEach(e => e.beep()); }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}

class MelodyHierarchy {
  protected _show: MelodyLayer[] = [];
  get show() { return this._show; }
  constructor(
    readonly svg: SVGGElement,
    readonly children: MelodyLayer[],
  ) { }
  onAudioUpdate() { this.show.forEach(e => e.beep()) }
  beep() { this.children.forEach(e => e.beep()); }
  setShow(visible_layers: MelodyLayer[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value === e.layer);
    this.setShow(visible_layer);
  }
}

function getMelodySVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  svg.id = "melody-note";
  svg.style.stroke = "rgb(64, 64, 64)";
  svg.onclick = deleteMelody;
  return svg;
}

function getSVGG(id: string, children: { svg: SVGGElement }[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));
  return svg;
}

export function buildMelody(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
  controllers: {
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly melody_beep: MelodyBeepController,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
  }
) {
  const layers = h_melodies.map((e, l) => {
    const parts = e.map(e => {
      const model = new MelodyModel(e);
      const svg = getMelodySVG();
      const view = new MelodyView(svg);
      return new Melody(model, view)
    })
    const svg = getSVGG(`layer-${l}`, parts);
    return new MelodyLayer(svg, parts, l)
  });

  const svg = getSVGG("melody", layers);
  const melody_hierarchy = new MelodyHierarchy(svg, layers);

  controllers.window.addListeners(...melody_hierarchy.children.flatMap(e => e.children).map(e => e.onWindowResized.bind(e)));
  controllers.hierarchy.addListeners(melody_hierarchy.onChangedLayer.bind(melody_hierarchy));
  controllers.time_range.addListeners(...melody_hierarchy.children.flatMap(e => e.children).map(e => e.onTimeRangeChanged.bind(e)));
  controllers.melody_color.addListeners(...melody_hierarchy.children.flatMap(e => e.children).map(e => e.setColor.bind(e)));
  controllers.melody_beep.checkbox.addListeners(...melody_hierarchy.children.flatMap(e => e.children).map(e => e.onMelodyBeepCheckChanged.bind(e)));
  controllers.melody_beep.volume.addListeners(...melody_hierarchy.children.flatMap(e => e.children).map(e => e.onMelodyVolumeBarChanged.bind(e)))
  controllers.audio.addListeners(...melody_hierarchy.children.map(e => e.onAudioUpdate.bind(e)));
  controllers.audio.addListeners(...melody_hierarchy.show.map(e => e.beep.bind(e)));
  melody_hierarchy.children.map(e => e.onAudioUpdate())
  melody_hierarchy.show.map(e => e.beep())

  return melody_hierarchy.svg;
}
