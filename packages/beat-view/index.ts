import { SvgCollection, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, piano_roll_height, reservation_range } from "@music-analyzer/view-parameters";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { getRange } from "@music-analyzer/math";
import { SVG } from "@music-analyzer/html";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { play } from "@music-analyzer/synth";

class BeatBarSVG implements Updatable {
  svg: SVGLineElement;
  begin: number;
  end: number;
  y1: number;
  y2: number;
  sound_reserved: boolean;
  constructor(beat_info: BeatInfo, i: number) {
    this.svg = SVG.line({ id: "bar", stroke: "#000", display:"none" }); //NOTE: 一旦非表示にしている
    this.begin = i * 60 / beat_info.tempo;
    this.end = (i + 1) * 60 / beat_info.tempo;
    this.y1 = 0;
    this.y2 = piano_roll_height;
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
    this.svg.setAttributes({ x1: CurrentTimeX.value + (this.begin - now_at) * NoteSize.value, x2: CurrentTimeX.value + (this.begin - now_at) * NoteSize.value, y1: this.y1, y2: this.y2 });
    // NOTE: うるさいので停止中
    0 && this.beepBeat();
  }
}

export const getBeatBars = (beat_info: BeatInfo, melodies: TimeAndMelodyAnalysis[]) => new SvgCollection(
  "beat-bars",
  getRange(0, Math.ceil(beat_info.tempo * melodies[melodies.length - 1].end) + beat_info.phase).map(i => new BeatBarSVG(beat_info, i))
);
