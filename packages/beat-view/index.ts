import { SvgWindow, TimeAndSVGs } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, piano_roll_height, reservation_range } from "@music-analyzer/view-parameters";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { getRange } from "@music-analyzer/math";
import { SVG } from "@music-analyzer/html";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { play } from "@music-analyzer/synth";

interface BeatBar extends TimeAndSVGs<SVGLineElement> {
  svg: SVGLineElement,
  y1: number,
  y2: number,
  sound_reserved: boolean
}

export const getBeatBars = (beat_info: BeatInfo, melodies: TimeAndMelodyAnalysis[]) => new SvgWindow("beat-bars",
  getRange(0, Math.ceil(beat_info.tempo * melodies[melodies.length - 1].end) + beat_info.phase).map((i): BeatBar => ({
    svg: SVG.line({ id: "bar", stroke: "#000", display: "none" }), //NOTE: 一旦非表示にしている
    begin: i * 60 / beat_info.tempo,
    end: (i + 1) * 60 / beat_info.tempo,
    y1: 0,
    y2: piano_roll_height,
    sound_reserved: false
  })),
  (e, now_at) => {
    e.svg.setAttributes({ x1: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value, x2: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value, y1: e.y1, y2: e.y2 });
    // NOTE: うるさいので停止中
    0 && beepBeat(e, now_at);
  }
);

const beepBeat = (beat_bar: BeatBar, now_at:number) => {
  if(now_at <= beat_bar.begin && beat_bar.begin < now_at + reservation_range){
    if (beat_bar.sound_reserved === false) {
      play([220], beat_bar.begin - now_at, 0.125);
      beat_bar.sound_reserved = true;
      setTimeout(() => { beat_bar.sound_reserved = false; }, reservation_range * 1000);
    }
  }
};
