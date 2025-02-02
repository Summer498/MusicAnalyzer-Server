import { SvgCollection__old, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, PianoRollHeight, reservation_range } from "@music-analyzer/view-parameters";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { getRange } from "@music-analyzer/math";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { play } from "@music-analyzer/synth";

class BeatBarSVG implements Updatable {
  readonly svg: SVGLineElement;
  readonly begin: number;
  readonly end: number;
  readonly y1: number;
  readonly y2: number;
  sound_reserved: boolean;
  constructor(beat_info: BeatInfo, i: number) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.id = "bar";
    this.svg.style.stroke = "#000";
    this.svg.style.display = "none";  //NOTE: 一旦非表示にしている
    this.begin = i * 60 / beat_info.tempo;
    this.end = (i + 1) * 60 / beat_info.tempo;
    this.y1 = 0;
    this.y2 = PianoRollHeight.value;
    this.sound_reserved = false;
  }
  beepBeat() {
    const now_at = NowAt.value;
    if (now_at <= this.begin && this.begin < now_at + reservation_range) {
      if (this.sound_reserved === false) {
        play([220], this.begin - now_at, 0.125);
        this.sound_reserved = true;
        setTimeout(() => { this.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  }
  onUpdate() {
    const now_at = NowAt.value;
    this.svg.setAttribute("x1", `${CurrentTimeX.value + (this.begin - now_at) * NoteSize.value}`);
    this.svg.setAttribute("x2", `${CurrentTimeX.value + (this.begin - now_at) * NoteSize.value}`);
    this.svg.setAttribute("y1", `${this.y1}`);
    this.svg.setAttribute("y2", `${this.y2}`);
    // NOTE: うるさいので停止中
    0 && this.beepBeat();
  }
}

export const getBeatBars = (beat_info: BeatInfo, melodies: TimeAndMelodyAnalysis[]) => new SvgCollection__old(
  "beat-bars",
  getRange(0, Math.ceil(beat_info.tempo * melodies[melodies.length - 1].end) + beat_info.phase).map(i => new BeatBarSVG(beat_info, i))
);
