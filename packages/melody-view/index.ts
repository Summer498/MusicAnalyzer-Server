import { SVG } from "@music-analyzer/html";
import { Gravity, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { fifthChromaToColor, hsv2rgb, rgbToString } from "@music-analyzer/color";
import { SvgWindow, black_key_prm, piano_roll_begin, reservation_range, size } from "@music-analyzer/view";
import { TimeAnd, search_items_begins_in_range } from "@music-analyzer/time-and";
import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { play } from "@music-analyzer/synth";

const ir_analysis_em = size;
const triangle_width = 5;
const triangle_height = 5;

export const insertMelody = () => {
  console.log("insertMelody called");
};

export const deleteMelody = () => {
  console.log("deleteMelody called");
};

export const getDMelodySVG = (detected_melodies: TimeAndMelodyAnalysis[]) => new SvgWindow("detected-melody",
  detected_melodies.map(e => ({
    svg: SVG.rect({
      name: "melody-note",
      fill: rgbToString(hsv2rgb(0, 0, 0.75)),
      stroke: "#444"
    }),
    begin: e.begin,
    end: e.end,
    note: e.note,
    y: (piano_roll_begin - e.note) * black_key_prm.height,
    w: e.end - e.begin,
    h: black_key_prm.height
  })),
  (e, current_time_x, now_at, note_size) => e.svg.setAttributes({
    x: current_time_x + (e.begin - now_at) * note_size,
    y: e.y,
    width: e.w * note_size,
    height: e.h,
    onclick: "MusicAnalyzer.insertMelody()",
  })
);

export const getMelodySVG = (melodies: TimeAndMelodyAnalysis[]) => new SvgWindow("melody",
  melodies.map(e => ({
    svg: SVG.rect({
      name: "melody-note",
      fill: fifthChromaToColor(e.note, 0.75, 0.9),
      stroke: "#444"
    }),
    begin: e.begin,
    end: e.end,
    note: e.note,
    y: (piano_roll_begin - e.note) * black_key_prm.height,
    w: e.end - e.begin,
    h: black_key_prm.height,
    sound_reserved: false,
  })),
  (e, current_time_x, now_at, note_size) => e.svg.setAttributes({
    x: current_time_x + (e.begin - now_at) * note_size,
    y: e.y,
    width: e.w * note_size,
    height: e.h,
    onclick: "MusicAnalyzer.deleteMelody()",
  })
);

export const getIRSymbolSVG = (melodies: TimeAndMelodyAnalysis[]) => new SvgWindow("I-R Symbols",
  melodies.map(e => {console.log("getIRSymbolSVG called"); return {
    svg: SVG.text(
      {
        id: "I-R Symbol",
        "font-family": 'Times New Roman',
        "font-size": `${ir_analysis_em}em`,
        "text-anchor": "middle",
      },
      e.melody_analysis.implication_realization.symbol,
    ),
    begin: e.begin,
    end: e.end,
    y: (piano_roll_begin - e.note) * black_key_prm.height,
    archetype: e.melody_analysis.implication_realization
  };}),
  (e, current_time_x, now_at, note_size) => e.svg.setAttributes({
    x: current_time_x + (e.begin - now_at) * note_size,
    y: e.y,
    fill: get_color_of_Narmour_concept(e.archetype) || "#000"
  })
);

interface ArrowSVG extends TimeAnd {
  triangle: SVGPolygonElement
  line: SVGLineElement
  note: number
  next: TimeAndMelodyAnalysis
  destination?: number
  src_x0: number
  dst_x0: number
  src_y0: number
  dst_y0: number
}

const getArrowSVG = (e: TimeAndMelodyAnalysis, next: TimeAndMelodyAnalysis, gravity: Gravity, fill: string, stroke: string): ArrowSVG => ({
  triangle: SVG.polygon({
    name: "gravity-arrow",
    stroke,
    "stroke-width": 5,
    fill,
  }),
  line: SVG.line({
    name: "gravity-arrow",
    stroke,
    "stroke-width": 5
  }),
  begin: e.begin,
  end: e.end,
  note: e.note,
  next,
  destination: gravity.destination,
  src_x0: (e.end - e.begin) / 2 + e.begin,
  dst_x0: next.begin,
  src_y0: (piano_roll_begin + 0.5 - e.note) * black_key_prm.height,
  dst_y0: (piano_roll_begin + 0.5 - gravity.destination!) * black_key_prm.height,
});

export const key_gravities: SVGElement[] = [];
export const chord_gravities: SVGElement[] = [];

export const getArrowSVGs = (melodies: TimeAndMelodyAnalysis[]) => melodies.map((e, i) => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: ArrowSVG[] = [];
  const scale_gravity = e.melody_analysis.scale_gravity;
  const chord_gravity = e.melody_analysis.chord_gravity;
  if (scale_gravity?.resolved && scale_gravity.destination !== undefined) {
    const svg = getArrowSVG(e, next, scale_gravity, fill, stroke);
    res.push(svg);
    key_gravities.push(svg.line);
    key_gravities.push(svg.triangle);
  }
  if (chord_gravity?.resolved && chord_gravity.destination !== undefined) {
    const svg = getArrowSVG(e, next, chord_gravity, fill, stroke);
    res.push(svg);
    chord_gravities.push(svg.line);
    chord_gravities.push(svg.triangle);
  }

  return res;
}).flat(2);

export const refresh_arrow = (arrow_svgs: ArrowSVG[], current_time_x: number, now_at: number, note_size: number) =>
  arrow_svgs.forEach(e => {
    const std_pos = now_at * note_size;
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

export const beepMelody = (melody_svgs: ReturnType<typeof getMelodySVG>, now_at: number, volume: number) => {
  const melody_range = search_items_begins_in_range(melody_svgs.show, now_at, now_at + reservation_range);
  for (let i = melody_range.begin_index; i < melody_range.end_index; i++) {
    const e = melody_svgs.show[i];
    if (e.sound_reserved === false) {
      play([440 * Math.pow(2, (e.note - 69) / 12)], e.begin - now_at, e.end - e.begin, volume);
      e.sound_reserved = true;
      setTimeout(() => { e.sound_reserved = false; }, reservation_range * 1000);
    }
  }
};