import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { hsv2rgb, rgbToString } from "@music-analyzer/color";
import { SvgCollection2, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, PianoRollBegin } from "@music-analyzer/view-parameters";
import { DMelodySwitcher } from "@music-analyzer/controllers";
import { insertMelody } from "./melody-editor-function";

class DMelodyModel {
  readonly begin: number;
  readonly end: number;
  readonly note?: number;
  constructor(d_melody: TimeAndMelodyAnalysis) {
    this.begin = d_melody.begin;
    this.end = d_melody.end;
    this.note = d_melody.note;
  }
}

class DMelodyView {
  readonly svg: SVGRectElement;
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.svg.id = "melody-note";
    this.svg.style.fill=rgbToString(hsv2rgb(0, 0, 0.75));
    this.svg.style.stroke = "#444";
  }
  set x(value: number) { this.svg.style.x = String(value); }
  set y(value: number) { this.svg.style.y = String(value); }
  set width(value: number) { this.svg.style.width = String(value); }
  set height(value: number) { this.svg.style.height = String(value); }
  set visibility(value: "visible" | "hidden") { this.svg.style.visibility = value; }
  set onclick(value: () => void) { this.svg.onclick = value; };
}

class DMelodyController implements Updatable {
  readonly model: DMelodyModel;
  readonly view: DMelodyView;
  readonly d_melody_switcher: DMelodySwitcher;
  constructor(d_melody: TimeAndMelodyAnalysis, d_melody_switcher: DMelodySwitcher) {
    this.model = new DMelodyModel(d_melody);
    this.view = new DMelodyView();
    this.d_melody_switcher = d_melody_switcher;
    this.initializeView();
    this.registerListeners();

    this.onUpdate();
  }
  initializeView() {
    this.view.y = this.model.note === undefined ? -99 : (PianoRollBegin.value - this.model.note) * black_key_prm.height;
    this.view.width = (this.model.end - this.model.begin) * NoteSize.value;
    this.view.height = black_key_prm.height;
  }
  registerListeners() {
    CurrentTimeX.onUpdate.push(this.updateX.bind(this));
    NowAt.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateWidth.bind(this));
  }

  updateX() { this.view.x = CurrentTimeX.value + (this.model.begin - NowAt.value) * NoteSize.value; }
  updateWidth() { this.view.width = (this.model.end - this.model.begin) * NoteSize.value; }
  onUpdate() {
    this.view.onclick = insertMelody;
    this.view.visibility = this.d_melody_switcher.checkbox.checked ? "visible" : "hidden";
  }
}

export const getDMelodyControllers = (detected_melodies: TimeAndMelodyAnalysis[], d_melody_switcher: DMelodySwitcher) => new SvgCollection2(
  "detected-melody",
  detected_melodies.map(e => new DMelodyController(e, d_melody_switcher))
);
