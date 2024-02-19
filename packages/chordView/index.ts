import { hsv2rgb, rgbToString } from "../../packages/Color/index";
import { Scale as _Scale } from "tonal";

type Scale = ReturnType<typeof _Scale.get>;

// コードを表す部分を作成
export const romanToColor = (roman: string, s: number, v: number) => {
  let i: number | undefined = undefined;
  const ROMAN = roman.toUpperCase();
  if (0) {
  } else if (ROMAN.includes("VII")) {
    i = 6;
  } else if (ROMAN.includes("VI")) {
    i = 3;
  } else if (ROMAN.includes("IV")) {
    i = 4;
  } // IV は V より先に検知しておく
  else if (ROMAN.includes("V")) {
    i = 0;
  } else if (ROMAN.includes("III")) {
    i = 1;
  } else if (ROMAN.includes("II")) {
    i = 5;
  } else if (ROMAN.includes("I")) {
    i = 2;
  }
  if (i === undefined) {
    console.log("888", roman);
    return "#000000";
  }
  const col = hsv2rgb(360 * i / 7, s, v);
  return rgbToString(col);
};

const c_dur = "C1D2EF3G4A5B";
const alt = "b♮#";
const green_hue = 120; // 0:red, 120:green, 240:blue
export const chordToColor = (tonic: string, s: number, v: number) => {
  if (tonic.length === 0) {
    return "#444";
  }
  const _chroma = c_dur.indexOf(tonic[0]);
  const chroma =
    tonic.length === 1 ? _chroma : _chroma + alt.indexOf(tonic[1]) - 1;
  const col = hsv2rgb(360 * chroma / 12 + green_hue, s, v);
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
  if (type === "aeolian") {
    return `${tonic?.toLowerCase()}-moll`;
  } else if (type === "ionian") {
    return `${tonic?.toUpperCase()}-dur`;
  } else if (type === "minor") {
    return `${tonic?.toUpperCase()}-moll`;
  } else if (type === "major") {
    return `${tonic?.toUpperCase()}-dur`;
  } else {
    return key.name;
  }
};
