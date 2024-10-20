import { SVG } from "@music-analyzer/html";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { hsv2rgb, rgbToString } from "@music-analyzer/color";
import { SvgCollection2, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, PianoRollBegin, } from "@music-analyzer/view-parameters";
import { DMelodySwitcher,  } from "@music-analyzer/controllers";
import { insertMelody } from "./melody-editor-function";

class DMelodyModel {
  begin: number;
  end: number;
  note: number;
  constructor(d_melody: TimeAndMelodyAnalysis) {
    this.begin = d_melody.begin;
    this.end = d_melody.end;
    this.note = d_melody.note;
  }
}

class DMelodyView {
  svg: SVGRectElement;
  constructor() {
    this.svg = SVG.rect();
    this.svg.setAttribute("name", "melody-note");
    this.svg.setAttribute("fill", rgbToString(hsv2rgb(0, 0, 0.75)));
    this.svg.setAttribute("stroke", "#444");
  }
  set x(value: number) { this.svg.setAttribute("x", `${value}`); }
  set y(value: number) { this.svg.setAttribute("y", `${value}`); }
  set width(value: number) { this.svg.setAttribute("width", `${value}`); }
  set height(value: number) { this.svg.setAttribute("height", `${value}`); }
  set visibility(value: "visible" | "hidden") { this.svg.setAttribute("visibility", value); }
  set onclick(value: () => void) { this.svg.onclick = value; };
}

class DMelodyController implements Updatable {
  model: DMelodyModel;
  view: DMelodyView;
  d_melody_switcher: DMelodySwitcher;
  constructor(d_melody: TimeAndMelodyAnalysis, d_melody_switcher: DMelodySwitcher) {
    this.model = new DMelodyModel(d_melody);
    this.view = new DMelodyView();
    this.d_melody_switcher = d_melody_switcher;
    this.initializeView();
    this.registerListeners();

    this.onUpdate();
  }
  initializeView() {
    this.view.y = (PianoRollBegin.value - this.model.note) * black_key_prm.height;
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
