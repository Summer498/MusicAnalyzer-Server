import { hsv2rgb, rgbToString, fifthToColor } from "@music-analyzer/color";
import { _Chord, _Note, _Scale, Chord, Scale } from "@music-analyzer/tonal-objects";
import { getRange, mod } from "@music-analyzer/math";
import { getLowerCase, getCapitalCase } from "@music-analyzer/stdlib";
import { SvgCollection, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, OctaveCount, PianoRollHeight, size } from "@music-analyzer/view-parameters";
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

class ChordNoteSVG implements Updatable {
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
  onUpdate() {
    this.svg.style.x = String(CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value);
    this.svg.style.y = String(this.y);
    this.svg.style.width = String(this.w * NoteSize.value);
    this.svg.style.height = String(this.h);
    this.svg.style.stroke = "#444";
    this.svg.style.fill = fifthToColor(this.tonic, 0.25, this.type === "major" ? 1 : 0.9);
  }
}

export const getChordNotesSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "chords",
  romans.map(e => {
    const chord = _Chord.get(e.chord);
    return getRange(0, OctaveCount.value).map(oct => chord.notes.map(note => new ChordNoteSVG(e, chord, note, oct)));
  }).flat(2)
);

class ChordNameSVG implements Updatable {
  readonly svg: SVGTextElement;
  readonly begin: number;
  readonly end: number;
  readonly y: number;
  readonly tonic: string;
  constructor(e: TimeAndRomanAnalysis) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = shorten_chord(_Chord.get(e.chord).name);
    this.svg.id = "chord-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.begin = e.begin;
    this.end = e.end;
    this.y = PianoRollHeight.value + chord_text_size;
    this.tonic = _Chord.get(e.chord).tonic!;
  }
  onUpdate() {
    this.svg.setAttribute("x", String(CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value));
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.style.fill = fifthToColor(this.tonic, 1, 0.75) || "#000";
  }
}

export const getChordNamesSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "chord-names",
  romans.map(e => new ChordNameSVG(e))
);

class ChordRomanSVG implements Updatable {
  readonly svg: SVGTextElement;
  readonly begin: number;
  readonly end: number;
  readonly y: number;
  readonly tonic: string;
  constructor(e: TimeAndRomanAnalysis) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = shorten_chord(e.roman);
    this.svg.id = "roman-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.begin = e.begin;
    this.end = e.end;
    this.y = PianoRollHeight.value + chord_text_size * 2 + chord_name_margin;
    this.tonic = _Chord.get(e.chord).tonic!;
  }
  onUpdate() {
    this.svg.setAttribute("x", String(CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value));
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.style.fill = fifthToColor(this.tonic, 1, 0.75) || "#000";
  }
}

export const getChordRomansSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "roman-names",
  romans.map(e => new ChordRomanSVG(e))
);

class ChordKeySVG implements Updatable {
  readonly svg: SVGTextElement;
  readonly begin: number;
  readonly end: number;
  readonly y: number;
  readonly tonic: string;
  constructor(e: TimeAndRomanAnalysis) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = shorten_key(_Scale.get(e.scale)) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.begin = e.begin;
    this.end = e.end;
    this.y = PianoRollHeight.value + chord_text_size * 2 + chord_name_margin;
    this.tonic = _Scale.get(e.scale).tonic!;
  }
  onUpdate() {
    this.svg.setAttribute("x", String(CurrentTimeX.value + (this.begin - NowAt.value) * NoteSize.value));
    this.svg.setAttribute("y", `${this.y}`);
    this.svg.style.fill = fifthToColor(this.tonic, 1, 0.75) || "#000";
  }
}

export const getChordKeysSVG = (romans: TimeAndRomanAnalysis[]) => new SvgCollection(
  "key-names",
  romans.map(e => new ChordKeySVG(e))
);