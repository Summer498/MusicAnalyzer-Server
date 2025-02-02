import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { _Scale } from "@music-analyzer/tonal-objects";
import { AccompanyToAudio } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, NowAtX, PianoRollHeight } from "@music-analyzer/view-parameters";
import { fifthToColor } from "@music-analyzer/color";
import { shorten_key } from "./shorten";
import { chord_name_margin, chord_text_em, chord_text_size } from "./chord-view-params";

export class ChordKeySVG implements AccompanyToAudio {
  readonly svg: SVGTextElement;
  readonly begin: number;
  readonly end: number;
  readonly y: number;
  readonly tonic: string;
  constructor(e: TimeAndRomanAnalysis) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = shorten_key(_Scale.get(e.scale)) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.begin = e.begin;
    this.end = e.end;
    this.y = PianoRollHeight.value + chord_text_size * 2 + chord_name_margin;
    this.tonic = _Scale.get(e.scale).tonic!;
  }
  onAudioUpdate() {
    this.svg.setAttribute("x", String(CurrentTimeX.value + this.begin * NoteSize.value - NowAtX.value));
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.style.fill = fifthToColor(this.tonic, 1, 0.75) || "#000";
  }
}

