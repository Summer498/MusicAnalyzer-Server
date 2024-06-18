import { CurrentTimeX, NoteSize, SvgWindow, TimeAndSVGs, piano_roll_height, reservation_range } from "@music-analyzer/view";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { getRange } from "@music-analyzer/math";
import { SVG } from "@music-analyzer/html";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { play } from "@music-analyzer/synth";
import { search_items_begins_in_range } from "@music-analyzer/time-and";

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
  (e, now_at) => e.svg.setAttributes({ x1: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value, x2: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value, y1: e.y1, y2: e.y2 })
);

export const beepBeat = (beat_bars: SvgWindow<SVGLineElement, BeatBar>, now_at:number, ) => {
  const beat_range = search_items_begins_in_range(beat_bars.show, now_at, now_at + reservation_range);
  for (let i = beat_range.begin_index; i < beat_range.end_index; i++) {
    const e = beat_bars.show[i];
    if (e.sound_reserved === false) {
      play([220], e.begin - now_at, 0.125);
      e.sound_reserved = true;
      setTimeout(() => { e.sound_reserved = false; }, reservation_range * 1000);
    }
  }
};