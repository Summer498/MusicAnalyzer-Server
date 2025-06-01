import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";
import { insertMelody } from "./melody-editor/insert";
import { hsv2rgb } from "@music-analyzer/color";
import { rgbToString } from "@music-analyzer/color";
import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { Time } from "@music-analyzer/time-and";
import { DMelodyController, TimeRangeController } from "@music-analyzer/controllers";

class DMelodyView {
  constructor(
    readonly svg: SVGRectElement
  ) { }
  set onclick(value: () => void) { this.svg.onclick = value; };
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}

class DMelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly melody_analysis: SerializedMelodyAnalysis;
  constructor(e: SerializedTimeAndAnalyzedMelody) {
    this.time = e.time;
    this.head = e.head;
    this.note = e.note;
    this.melody_analysis = e.melody_analysis;
  }
}

class DMelody {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: DMelodyModel,
    readonly view: DMelodyView,
  ) {
    this.onAudioUpdate();
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.view.updateX(PianoRollConverter.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(PianoRollConverter.midi2NNBlackCoordinate(this.model.note)); }
  updateWidth() { this.view.updateWidth(PianoRollConverter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(black_key_height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
  onAudioUpdate() {
    this.view.onclick = insertMelody;
  }
  onTimeRangeChanged = this.onWindowResized
}

class DMelodySeries {
  readonly children_model: { readonly time: Time }[];
  #show: DMelody[];
  get show() { return this.#show; };

  constructor(
    readonly svg: SVGGElement,
    readonly children: DMelody[],
  ) {
    this.children_model = this.children.map(e => e.model);
    this.#show = children;
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}

function getMelodyViewSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  svg.id = "melody-note";
  svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
  svg.style.stroke = "rgb(64, 64, 64)";
  return svg;
}

function getSVGG(id: string, parts: { svg: SVGElement }[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  parts.forEach(e => svg.appendChild(e.svg));
  return svg;
}

export function buildDMelody(
  d_melody: SerializedTimeAndAnalyzedMelody[],
    controllers: {
      readonly audio: AudioReflectableRegistry,
      readonly d_melody: DMelodyController,
      readonly window: WindowReflectableRegistry,
      readonly time_range: TimeRangeController,
    }
) {
  const parts = d_melody.map(e => {
    const svg = getMelodyViewSVG();
    const model = new DMelodyModel(e);
    const view = new DMelodyView(svg);
    return new DMelody(model, view)
  })
  const svg = getSVGG("detected-melody", parts);

  const d_melody_collection = new DMelodySeries(svg, parts);

  controllers.window.addListeners(...d_melody_collection.children.map(e => e.onWindowResized.bind(e)));
  controllers.time_range.addListeners(...d_melody_collection.children.map(e => e.onTimeRangeChanged.bind(e)));
  controllers.d_melody.addListeners(d_melody_collection.onDMelodyVisibilityChanged.bind(d_melody_collection));
  controllers.audio.addListeners(...d_melody_collection.children.map(e => e.onAudioUpdate.bind(e)));
  d_melody_collection.children.map(e => e.onAudioUpdate())

  return d_melody_collection.svg;
}
