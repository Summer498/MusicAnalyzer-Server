import { HTML, SVG } from "@music-analyzer/html";
import { Gravity, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { fifthChromaToColor, hsv2rgb, rgbToString } from "@music-analyzer/color";
import { SvgCollection, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, black_key_prm, piano_roll_begin, reservation_range, size } from "@music-analyzer/view-parameters";
import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";
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

class DMelodySVG implements Updatable {
  svg: SVGRectElement;
  begin: number;
  end: number;
  note: number;
  y: number;
  w: number;
  h: number;
  constructor(d_melody: TimeAndMelodyAnalysis) {
    this.svg = SVG.rect({
      name: "melody-note",
      fill: rgbToString(hsv2rgb(0, 0, 0.75)),
      stroke: "#444"
    });
    this.begin = d_melody.begin;
    this.end = d_melody.end;
    this.note = d_melody.note;
    this.y = (piano_roll_begin - d_melody.note) * black_key_prm.height;
    this.w = d_melody.end - d_melody.begin;
    this.h = black_key_prm.height;
  }
  onUpdate(now_at: number) {
    this.svg.setAttributes({
      x: CurrentTimeX.value + (this.begin - now_at) * NoteSize.value,
      y: this.y,
      width: this.w * NoteSize.value,
      height: this.h,
      onclick: "MusicAnalyzer.insertMelody()",
    });
  }
}

export const getDMelodySVGs = (detected_melodies: TimeAndMelodyAnalysis[]) => new SvgCollection(
  "detected-melody",
  detected_melodies.map(e => new DMelodySVG(e))
);

class MelodySVG implements Updatable {
  svg: SVGRectElement;
  begin: number;
  end: number;
  note: number;
  y: number;
  w: number;
  h: number;
  sound_reserved: boolean;

  constructor(melody: TimeAndMelodyAnalysis) {
    this.svg = SVG.rect({
      name: "melody-note",
      fill: fifthChromaToColor(melody.note, 0.75, 0.9),
      stroke: "#444"
    });
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.y = (piano_roll_begin - melody.note) * black_key_prm.height;
    this.w = melody.end - melody.begin;
    this.h = black_key_prm.height;
    this.sound_reserved = false;
  }

  beepMelody = (now_at: number, volume: number) => {
    if (now_at <= this.begin && this.begin < now_at + reservation_range) {
      if (this.sound_reserved === false) {
        play([440 * Math.pow(2, (this.note - 69) / 12)], this.begin - now_at, this.end - this.begin, volume);
        this.sound_reserved = true;
        setTimeout(() => { this.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  };

  onUpdate(now_at: number) {
    this.svg.setAttributes({
      x: CurrentTimeX.value + (this.begin - now_at) * NoteSize.value,
      y: this.y,
      width: this.w * NoteSize.value,
      height: this.h,
      onclick: "MusicAnalyzer.deleteMelody()",
    });
    melody_beep_switcher.checked && this.beepMelody(now_at, Number(melody_beep_volume.value) / 400);
  }
}

export const getMelodySVGs = (melodies: TimeAndMelodyAnalysis[]) => new SvgCollection(
  "melody",
  melodies.map(e => new MelodySVG(e))
);

class IRSymbolSVG implements Updatable {
  svg: SVGTextElement;
  begin: number;
  end: number;
  y: number;
  archetype: Archetype;
  constructor(melody: TimeAndMelodyAnalysis) {
    this.svg = SVG.text(
      {
        id: "I-R Symbol",
        "font-family": 'Times New Roman',
        "font-size": `${ir_analysis_em}em`,
        "text-anchor": "middle",
      },
      melody.melody_analysis.implication_realization.symbol,
    );
    this.begin = melody.begin;
    this.end = melody.end;
    this.y = (piano_roll_begin - melody.note) * black_key_prm.height;
    this.archetype = melody.melody_analysis.implication_realization;
  }
  onUpdate(now_at: number) {
    this.svg.setAttributes({
      x: CurrentTimeX.value + (this.begin - now_at) * NoteSize.value,
      y: this.y,
      fill: get_color_of_Narmour_concept(this.archetype) || "#000"
    });
  };
}

export const getIRSymbolSVGs = (melodies: TimeAndMelodyAnalysis[]) => {
  const IR_svgs = new SvgCollection(
    "I-R Symbols",
    melodies.map(e => new IRSymbolSVG(e))
  );
  /*
  console.log("IR symbols");
  console.log(IR_svgs);
  */
  return IR_svgs;
};


class ArrowSVG implements Updatable {
  svg: SVGGElement;
  begin: number;
  end: number;
  triangle: SVGPolygonElement;
  line: SVGLineElement;
  note: number;
  next: TimeAndMelodyAnalysis;
  destination?: number;
  src_x0: number;
  dst_x0: number;
  src_y0: number;
  dst_y0: number;
  constructor(melody: TimeAndMelodyAnalysis, next: TimeAndMelodyAnalysis, gravity: Gravity, fill: string, stroke: string) {
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

    this.svg = SVG.g(
      { name: "gravity" }, "", [
      triangle,
      line
    ]);
    this.triangle = triangle;
    this.line = line;
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.next = next;
    this.destination = gravity.destination;
    this.src_x0 = (melody.end - melody.begin) / 2 + melody.begin;
    this.dst_x0 = next.begin;
    this.src_y0 = (piano_roll_begin + 0.5 - melody.note) * black_key_prm.height;
    this.dst_y0 = (piano_roll_begin + 0.5 - gravity.destination!) * black_key_prm.height;
  }
  onUpdate(now_at: number) {
    const std_pos = now_at * NoteSize.value;
    const src_x = this.src_x0 * NoteSize.value - std_pos + CurrentTimeX.value;
    const dst_x = this.dst_x0 * NoteSize.value - std_pos + CurrentTimeX.value;
    const src_y = this.src_y0;
    const dst_y = this.dst_y0;

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
    this.triangle.setAttributes({ points: `${p.join(",")}` });
    this.line.setAttributes({ x1: src_x, x2: dst_x, y1: src_y, y2: dst_y });
  }
}

export const key_gravities: SVGElement[] = [];
export const chord_gravities: SVGElement[] = [];

export const getArrowSVGs = (melodies: TimeAndMelodyAnalysis[]) => new SvgCollection(
  "gravity-arrow",
  melodies.map((melody, i) => {
    const stroke = rgbToString([0, 0, 0]);
    const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
    const fill = rgbToString([0, 0, 0]);
    const res: ArrowSVG[] = [];
    const scale_gravity = melody.melody_analysis.scale_gravity;
    const chord_gravity = melody.melody_analysis.chord_gravity;
    if (scale_gravity?.resolved && scale_gravity.destination !== undefined) {
      const svg = new ArrowSVG(melody, next, scale_gravity, fill, stroke);
      res.push(svg);
      key_gravities.push(svg.line);
      key_gravities.push(svg.triangle);
    }
    if (chord_gravity?.resolved && chord_gravity.destination !== undefined) {
      const svg = new ArrowSVG(melody, next, chord_gravity, fill, stroke);
      res.push(svg);
      chord_gravities.push(svg.line);
      chord_gravities.push(svg.triangle);
    }
    return res;
  }).flat(2)
);
