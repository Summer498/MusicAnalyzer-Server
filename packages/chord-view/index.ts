import { hsv2rgb, rgbToString, fifthToColor } from "@music-analyzer/color";
import { _Chord, _Note, _Scale, Scale } from "@music-analyzer/tonal-objects";
import { getRange, mod } from "@music-analyzer/math";
import { getLowerCase, getCapitalCase } from "@music-analyzer/stdlib";
import { SvgWindow } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, black_key_prm, octave_cnt, piano_roll_height, size } from "@music-analyzer/view-parameters";
import { SVG } from "@music-analyzer/html";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";

const chord_text_em = size;
export const chord_text_size = 16 * chord_text_em;
export const chord_name_margin = 5;

// コードを表す部分を作成
export const romanToColor = (roman: string, s: number, v: number) => {
  let i: number | undefined = undefined;
  const ROMAN = roman.toUpperCase();
  if (0) { }
  else if (ROMAN.includes("VII")) { i = 6; }
  else if (ROMAN.includes("VI")) { i = 3; }
  else if (ROMAN.includes("IV")) { i = 4; } // IV は V より先に検知しておく
  else if (ROMAN.includes("V")) { i = 0; }
  else if (ROMAN.includes("III")) { i = 1; }
  else if (ROMAN.includes("II")) { i = 5; }
  else if (ROMAN.includes("I")) { i = 2; }
  if (i === undefined) {
    console.log("888", roman);
    return "#000000";
  }
  const col = hsv2rgb(360 * i / 7, s, v);
  return rgbToString(col);
};

export const shorten_chord = (chord: string) => {
  const M7 = chord.replace("major seventh", "M7");
  const major = M7.replace("major", "");
  const minor = major.replace("minor ", "m").replace("minor", "m");
  const seventh = minor.replace("seventh", "7");
  return seventh;
};

export const shorten_key = (key: Scale) => {
  const tonic = key.tonic;
  const type = key.type;
  if (type === "aeolian") { return getLowerCase(`${tonic}-moll`); }
  else if (type === "ionian") { return getCapitalCase(`${tonic}-dur`); }
  else if (type === "minor") { return getCapitalCase(`${tonic}-moll`); }
  else if (type === "major") { return getCapitalCase(`${tonic}-dur`); }
  else { return key.name; }
};

export const getChordNotesSVG = (romans: TimeAndRomanAnalysis[]) => new SvgWindow("chords", 
  romans.map(e => {
    const chord = _Chord.get(e.chord);
    return getRange(0, octave_cnt).map(oct => chord.notes.map(note => ({
      svg: SVG.rect(),
      begin: e.begin,
      end: e.end,
      y: (-1 - mod(_Note.chroma(note), 12) + 12 * (oct + 1)) * black_key_prm.height,
      w: e.end - e.begin,
      h: black_key_prm.height,
      tonic: chord.tonic!,
      type: chord.type,
    })));
  }).flat(2),
  (e, now_at) => e.svg.setAttributes({
    x: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value,
    y: e.y,
    width: e.w * NoteSize.value,
    height: e.h,
    stroke: "#444",
    fill: fifthToColor(e.tonic, 0.25, e.type === "major" ? 1 : 0.9),
  })
);

export const getChordNamesSVG = (romans: TimeAndRomanAnalysis[]) => new SvgWindow("chord-names", 
  romans.map(e => ({
    svg: SVG.text(
      {
        id: "chord-name",
        "font-family": 'Times New Roman',
        "font-size": `${chord_text_em}em`,
      },
      shorten_chord(_Chord.get(e.chord).name)
    ),
    begin: e.begin,
    end: e.end,
    y: piano_roll_height + chord_text_size,
    tonic: _Chord.get(e.chord).tonic!
  })),
  (e, now_at) => e.svg.setAttributes({
    x: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value,
    y: e.y,
    fill: fifthToColor(e.tonic, 1, 0.75) || "#000"
  })
);

export const getChordRomansSVG = (romans: TimeAndRomanAnalysis[]) => new SvgWindow("roman-names", 
  romans.map(e => ({
    svg: SVG.text(
      {
        id: "roman-name",
        "font-family": 'Times New Roman',
        "font-size": `${chord_text_em}em`,
      },
      shorten_chord(e.roman)
    ),
    begin: e.begin,
    end: e.end,
    y: piano_roll_height + chord_text_size * 2 + chord_name_margin,
    tonic: _Chord.get(e.chord).tonic!
  })),
  (e, now_at) => e.svg.setAttributes({
    x: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value,
    y: e.y,
    fill: fifthToColor(e.tonic, 1, 0.75) || "#000"
  })
);

export const getChordKeysSVG = (romans: TimeAndRomanAnalysis[]) => new SvgWindow("key-names", 
  romans.map(e => ({
    svg: SVG.text(
      {
        id: "key-name",
        "font-family": "Times New Roman",
        "font-size": `${chord_text_em}em`,
        "text-anchor": "end",
      },
      shorten_key(_Scale.get(e.scale)) + ': '
    ),
    begin: e.begin,
    end: e.end,
    y: piano_roll_height + chord_text_size * 2 + chord_name_margin,
    tonic: _Scale.get(e.scale).tonic!
  })),
  (e, now_at) => e.svg.setAttributes({
    x: CurrentTimeX.value + (e.begin - now_at) * NoteSize.value,
    y: e.y,
    fill: fifthToColor(e.tonic, 1, 0.75) || "#000"
  })
);