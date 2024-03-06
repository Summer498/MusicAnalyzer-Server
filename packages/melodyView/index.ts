import { SVG } from "../HTML";
import { TimeAndMelodyAnalysis } from "../melodyAnalyze";
import { fifthChromaToColor, hsv2rgb, rgbToString } from "../Color";
import { SvgWindow, black_key_prm, piano_roll_begin, reservation_range } from "../View";
import { search_items_begins_in_range } from "../timeAnd/";
import { play } from "../Synth";

const triangle_width = 5;
const triangle_height = 5;

export const getDMelodySVG = (detected_melodies: TimeAndMelodyAnalysis[]) => new SvgWindow("detected-melody",
  detected_melodies.map(e => ({
    svg: SVG.rect(
      {
        name: "melody-note",
        fill: rgbToString(hsv2rgb(0, 0, 0.75)),
        stroke: "#444"
      }
    ),
    begin: e.begin,
    end: e.end,
    note: e.note,
    y: (piano_roll_begin - e.note) * black_key_prm.height,
    w: e.end - e.begin,
    h: black_key_prm.height
  })),
  (e, current_time_x, now_at, note_size) => e.svg.setAttributes(
    {
      x: current_time_x + (e.begin - now_at) * note_size,
      y: e.y, width: e.w * note_size,
      height: e.h,
      onclick: "insertMelody()",
    })
);

export const getMelodySVG = (melodies: TimeAndMelodyAnalysis[]) => new SvgWindow("melody",
  melodies.map(e => ({
    svg: SVG.rect(
      {
        name: "melody-note",
        fill: fifthChromaToColor(e.note, 0.75, 0.9),
        stroke: "#444"
      }
    ),
    begin: e.begin,
    end: e.end,
    note: e.note,
    y: (piano_roll_begin - e.note) * black_key_prm.height,
    w: e.end - e.begin,
    h: black_key_prm.height,
    sound_reserved: false,
  })),
  (e, current_time_x, now_at, note_size) => e.svg.setAttributes(
    {
      x: current_time_x + (e.begin - now_at) * note_size,
      y: e.y,
      width: e.w * note_size,
      height: e.h,
      onclick: "deleteMelody()",
    }
  )
);

export const getArrowSVG = (melodies: TimeAndMelodyAnalysis[]) => melodies.map((e, i) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  // let fill = rgbToString(hsv2rgb(180 + 360 * 2 / 7, 0.5, 0.9));
  // if (i === 1 && e.roman_name !== undefined) { fill = romanToColor(e.roman_name, 0.5, 0.9) }
  return e.melody_analysis.gravity.filter(g => g.resolved && g.destination !== undefined).map(gravity => ({
    triangle: SVG.polygon(
      {
        name: "gravity-arrow",
        stroke,
        "stroke-width": 5,
        fill,
      }
    ),
    line: SVG.line(
      {
        name: "gravity-arrow",
        stroke,
        "stroke-width": 5
      }
    ),
    begin: e.begin,
    end: e.end,
    note: e.note,
    next,
    destination: gravity.destination,
    src_x0: (e.end - e.begin) / 2 + e.begin,
    dst_x0: next.begin,
    src_y0: (piano_roll_begin + 0.5 - e.note) * black_key_prm.height,
    dst_y0: (piano_roll_begin + 0.5 - gravity.destination!) * black_key_prm.height,
  }));
}).flat(2);

type ArrowSVGs = ReturnType<typeof getArrowSVG>;

export const refresh_arrow = (arrow_svgs: ArrowSVGs, note_size: number, current_time_x: number, std_pos: number) => arrow_svgs.forEach(e => {
  const src_x = e.src_x0 * note_size - std_pos + current_time_x;
  const dst_x = e.dst_x0 * note_size - std_pos + current_time_x;
  const src_y = e.src_y0;
  const dst_y = e.dst_y0;

  const dx = dst_x - src_x;
  const dy = dst_y - src_y;
  const r = Math.sqrt(dx * dx + dy * dy);
  const cos = -dy / r;
  const sin = dx / r;
  const p = [
    dst_x,
    dst_y,
    dst_x + cos * triangle_width - sin * triangle_height,
    dst_y + sin * triangle_width + cos * triangle_height,
    dst_x + cos * -triangle_width - sin * triangle_height,
    dst_y + sin * -triangle_width + cos * triangle_height
  ];
  e.triangle.setAttributes({ points: `${p.join(",")}` });
  e.line.setAttributes({ x1: src_x, x2: dst_x, y1: src_y, y2: dst_y });
});

export const beepMelody = (melody_svgs: ReturnType<typeof getMelodySVG>, now_at: number) => {
  const melody_range = search_items_begins_in_range(melody_svgs.show, now_at, now_at + reservation_range);
  for (let i = melody_range.begin_index; i < melody_range.end_index; i++) {
    const e = melody_svgs.show[i];
    if (e.sound_reserved === false) {
      play([440 * Math.pow(2, (e.note - 69) / 12)], e.begin - now_at, e.end - e.begin);
      e.sound_reserved = true;
      setTimeout(() => { e.sound_reserved = false; }, reservation_range * 1000);
    }
  }
};