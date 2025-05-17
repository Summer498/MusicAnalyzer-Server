import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { insertMelody } from "./melody-editor/insert";
import { hsv2rgb } from "@music-analyzer/color";
import { rgbToString } from "@music-analyzer/color";
import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { Time } from "@music-analyzer/time-and";

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

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody> {
  constructor(
    children: DMelody[],
  ) {
    super("detected-melody", children);
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
}

export function buildDMelody(
  d_melody: SerializedTimeAndAnalyzedMelody[],
) {
  const parts = d_melody.map(e => {
    const model = new DMelodyModel(e);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    svg.id = "melody-note";
    svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
    svg.style.stroke = "rgb(64, 64, 64)";

    const view = new DMelodyView(svg);

    return new DMelody(model, view)
  })
  return new DMelodySeries(parts);
}
