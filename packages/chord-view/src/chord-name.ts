import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { fifthToColor } from "@music-analyzer/color";
import { _Chord } from "@music-analyzer/tonal-objects";
import { Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_text_em, chord_text_size } from "./chord-view-params";
import { shorten_chord } from "./shorten";

export class ChordNameSVG implements Updatable {
  readonly svg: SVGTextElement;
  readonly begin: number;
  readonly end: number;
  readonly y: number;
  readonly tonic: string;
  constructor(e: TimeAndRomanAnalysis) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = shorten_chord(_Chord.get(e.chord).name);
    this.svg.id = "chord-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.begin = e.begin;
    this.end = e.end;
    this.y = PianoRollHeight.value + chord_text_size;
    this.tonic = _Chord.get(e.chord).tonic!;
  }
  onUpdate() {
    this.svg.setAttribute("x", String(CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value));
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.style.fill = fifthToColor(this.tonic, 1, 0.75) || "#000";
  }
}

