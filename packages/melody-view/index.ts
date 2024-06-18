import { HTML, SVG } from "@music-analyzer/html";
import { Gravity, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { fifthChromaToColor, hsv2rgb, rgbToString } from "@music-analyzer/color";
import { CurrentTimeX, NoteSize, SvgWindow, black_key_prm, piano_roll_begin, reservation_range, size } from "@music-analyzer/view";
import { TimeAnd, search_items_begins_in_range } from "@music-analyzer/time-and";
import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { play } from "@music-analyzer/synth";

const ir_analysis_em = size;
const triangle_width = 5;
const triangle_height = 5;

export const melody_beep_switcher = HTML.input_checkbox({ id: "melody_beep_switcher", name: "melody_beep_switcher" });
melody_beep_switcher.checked = true;
export const melody_beep_volume = HTML.input_range({ id: "melody_beep_volume", min: 0, max: 100, step: 1 });
export const show_melody_beep_volume = HTML.span({}, `volume: ${melody_beep_volume.value}`);
melody_beep_volume.addEventListener("input", e => { show_melody_beep_volume.textContent = `volume: ${melody_beep_volume.value}`; });


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
  (e, now_at) => e.svg.setAttributes({
    x: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value,
    y: e.y,
    width: e.w * NoteSize.value,
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
  (e, now_at) => {
    e.svg.setAttributes({
      x: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value,
      y: e.y,
      width: e.w * NoteSize.value,
      height: e.h,
      onclick: "MusicAnalyzer.deleteMelody()",
    });
  }
);

export const getIRSymbolSVG = (melodies: TimeAndMelodyAnalysis[]) => {
  const IR_svgs = new SvgWindow("I-R Symbols",
    melodies.map(e => ({
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
    })),
    (e, now_at) => e.svg.setAttributes({
      x: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value,
      y: e.y,
      fill: get_color_of_Narmour_concept(e.archetype) || "#000"
    })
  );
  console.log("IR symbols");
  console.log(IR_svgs);
  return IR_svgs;
};


interface ArrowSVG extends TimeAnd {
  svg: SVGGElement
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

const getArrowSVG = (e: TimeAndMelodyAnalysis, next: TimeAndMelodyAnalysis, gravity: Gravity, fill: string, stroke: string): ArrowSVG => {
  const triangle = SVG.polygon({
    name: "gravity-arrow",
    stroke,
    "stroke-width": 5,
    fill,
  });
  const line = SVG.line({
    name: "gravity-arrow",
    stroke,
    "stroke-width": 5
  });
  return {
    svg: SVG.g(
      { name: "gravity" }, "", [
      triangle,
      line
    ]),
    triangle,
    line,
    begin: e.begin,
    end: e.end,
    note: e.note,
    next,
    destination: gravity.destination,
    src_x0: (e.end - e.begin) / 2 + e.begin,
    dst_x0: next.begin,
    src_y0: (piano_roll_begin + 0.5 - e.note) * black_key_prm.height,
    dst_y0: (piano_roll_begin + 0.5 - gravity.destination!) * black_key_prm.height,
  };
};

export const key_gravities: SVGElement[] = [];
export const chord_gravities: SVGElement[] = [];

export const getArrowSVGs = (melodies: TimeAndMelodyAnalysis[]) => new SvgWindow("gravity-arrow",
  melodies.map((e, i) => {
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
  }).flat(2),

  (arrow_svg: ArrowSVG, now_at: number) => {
    const std_pos = now_at * NoteSize.value;
    const src_x = arrow_svg.src_x0 * NoteSize.value - std_pos + CurrentTimeX.value;
    const dst_x = arrow_svg.dst_x0 * NoteSize.value - std_pos + CurrentTimeX.value;
    const src_y = arrow_svg.src_y0;
    const dst_y = arrow_svg.dst_y0;
  
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
    arrow_svg.triangle.setAttributes({ points: `${p.join(",")}` });
    arrow_svg.line.setAttributes({ x1: src_x, x2: dst_x, y1: src_y, y2: dst_y });
  }
);

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