import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { fifthToColor } from "@music-analyzer/color";
import { mod } from "@music-analyzer/math";
import { _Note, Chord } from "@music-analyzer/tonal-objects";
import { AccompanyToAudio } from "@music-analyzer/view";
import { black_key_prm, CurrentTimeX, NoteSize, NowAt } from "@music-analyzer/view-parameters";

export class ChordNoteSVG implements AccompanyToAudio {
  readonly svg: SVGRectElement;
  readonly begin: number;
  readonly end: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly tonic: string;
  readonly type: string;
  constructor(e: TimeAndRomanAnalysis, chord: Chord, note: string, oct: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.begin = e.begin;
    this.end = e.end;
    this.y = (-1 - mod(_Note.chroma(note), 12) + 12 * (oct + 1)) * black_key_prm.height;
    this.w = e.end - e.begin;
    this.h = black_key_prm.height;
    this.tonic = chord.tonic!;
    this.type = chord.type;
  }
  onAudioUpdate() {
    this.svg.style.x = String(CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.w * NoteSize.value);
    this.svg.style.height = String(this.h);
    this.svg.style.stroke = "#444";
    this.svg.style.fill = fifthToColor(this.tonic, 0.25, this.type === "major" ? 1 : 0.9);
  }
}

