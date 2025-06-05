import { getInterval } from "@music-analyzer/tonal-objects";
import { IntervalName } from "@music-analyzer/tonal-objects";
import { NoteLiteral } from "@music-analyzer/tonal-objects";
import { intervalOf } from "@music-analyzer/tonal-objects";
import { getNote } from "@music-analyzer/tonal-objects";
import { getSemitones } from "@music-analyzer/tonal-objects";
import { hsv2rgb } from "@music-analyzer/color";
import { rgbToString } from "@music-analyzer/color";
import { Interval } from "@music-analyzer/tonal-objects";

const _sgn = (x: number) => x < 0 ? -1 : x && 1
const _abs = (x: number) => x < 0 ? -x : x

const M3 = getInterval("M3");
const m3 = getInterval("m3");

type DirectionName = "mL" | "mN" | "mR"
type MagnitudeName = "AA" | "AB";

type ProspectiveTriadSymbol =
  | "P" | "IP" | "VP"
  | "R" | "IR" | "VR"
  | "D" | "ID"

type RetrospectiveTriadSymbol =
  | "(P)" | "(IP)" | "(VP)"
  | "(R)" | "(IR)" | "(VR)"
  | "(D)" | "(ID)"

type RetrospectiveDirectionalTriadSymbol =
  | "(uP)" | "(uIP)" | "(uVP)" | "(uR)" | "(uIR)" | "(uVR)" | "(uID)"
  | "(lIP)" | "(lR)" | "(lD)"
  | "(dP)" | "(dIP)" | "(dVP)" | "(dR)" | "(dIR)" | "(dVR)" | "(dID)"

type ProspectiveDirectionalTriadSymbol =
  | "uP" | "uIP" | "uVP" | "uR" | "uIR" | "uVR" | "uID"
  | "dP" | "dIP" | "dVP" | "dR" | "dIR" | "dVR" | "dID"
  | "lIP" | "lR" | "lD"

type TriadSymbol = ProspectiveTriadSymbol | RetrospectiveTriadSymbol;
type ProspectiveSymbol = ProspectiveTriadSymbol | "M" | "dyad"
type ArchetypeSymbol = "" | ProspectiveSymbol | RetrospectiveTriadSymbol

type ProspectiveDirectionalSymbol = ProspectiveDirectionalTriadSymbol | "M" | "uDyad" | "dDyad"
type ArchetypeDirectionalSymbol = "" | ProspectiveDirectionalSymbol | RetrospectiveDirectionalTriadSymbol
type DirectionalTriadSymbol = ProspectiveDirectionalTriadSymbol | RetrospectiveDirectionalTriadSymbol;

interface IRegistralReturnForm {
  readonly is_null: boolean;
  readonly return_degree: "" | ReturnType<typeof intervalOf>;
}

const getRegistralReturnForm = (notes: NoteLiteral[]) => {
  if (notes.length !== 3) { throw new Error(`Invalid argument length. Required 3 arguments but given was ${notes.length} notes: ${JSON.stringify(notes)}`,); }
  if (getNote(notes[0]) === getNote("")) {
    // null object
    const return_degree = ""; //_Interval.get("");
    return { is_null: true, return_degree } as IRegistralReturnForm;
  }
  const return_degree = intervalOf(notes[0], notes[2]); //_Interval.get(_Interval.distance(notes[2], notes[0]));
  const dir1 = Math.sign(
    getSemitones(intervalOf(notes[0], notes[1])),
  );
  const dir2 = Math.sign(
    getSemitones(intervalOf(notes[1], notes[2])),
  );
  const is_null = dir1 === dir2;
  return { is_null, return_degree } as IRegistralReturnForm;
}

const NULL_REGISTRAL_RETURN_FORM = getRegistralReturnForm(["", "", ""]);

interface IDirection {
  readonly name: DirectionName,
  readonly value: number
  readonly closure_degree: number;
}

const getDirection = (
  name: DirectionName,
  value: number
): IDirection => {
  // NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
  if (name === "mL") { return { name, value, closure_degree: 1 } }
  if (name === "mN") { return { name, value, closure_degree: 0 } }
  if (name === "mR") { return { name, value, closure_degree: -1 } }
  throw new Error(`from getDirection: invalid direction name (${name}) reserved`);
}

interface IMagnitude {
  readonly name: MagnitudeName,
  readonly value: number
  readonly closure_degree: number;
}

const getMagnitude = (
  name: MagnitudeName,
  value: number
): IMagnitude => {
  // NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
  if (name === "AA") { return { name, value, closure_degree: 1 }; }
  if (name === "AB") { return { name, value, closure_degree: 2 }; }
  throw new Error(`from getMagnitude: invalid magnitude name (${name}) reserved`);
}

interface IMotion {
  readonly direction: IDirection;
  readonly magnitude: IMagnitude;
  readonly closure: 0 | 1;
}

const getMotionSymbol = (e: IMotion): `${DirectionName}/${MagnitudeName}` => `${e.direction.name}/${e.magnitude.name}`;

const getMotion = (dir: IDirection, mgn: IMagnitude): IMotion => ({
  direction: dir,
  magnitude: mgn,
  closure: dir.name === "mL" && mgn.name === "AB" ? 1 : 0,
})

const getIntervallicMotion = (prev: Interval, curr: Interval) => {
  const dir_map: ["mL", "mN", "mR"] = ["mL", "mN", "mR"];

  // registral
  const pd = _sgn(prev.semitones);
  const cd = _sgn(curr.semitones);

  // interval
  const C = (cd - pd ? m3 : M3).semitones;
  const p = _abs(prev.semitones);
  const c = _abs(curr.semitones);
  const d = c - p;
  const sgn = d < 0 ? -1 : d && 1;
  const abs = d < 0 ? -d : d;
  return getMotion(
    getDirection(dir_map[sgn + 1], sgn),
    getMagnitude(abs < C ? "AA" : "AB", abs)
  )
}

const getRegistralMotion = (prev: Interval, curr: Interval) => {
  const dir_map: ["mL", "mN", "mR"] = ["mL", "mN", "mR"];
  const mgn_map: ["AB", "AA", "AA"] = ["AB", "AA", "AA"];

  const p = _sgn(prev.semitones);
  const c = _sgn(curr.semitones);
  const d = c - p
  const sgn = d ? -1 : p && 1;
  const abs = d ? -1 : p && 1;
  return getMotion(
    getDirection(dir_map[sgn + 1], sgn),
    getMagnitude(mgn_map[abs + 1], abs)
  );
}

function getArchetype(): INull_ad;
function getArchetype(note: NoteLiteral): IMonad;
function getArchetype(note1: NoteLiteral, note2: NoteLiteral): IDyad;
function getArchetype(note1: NoteLiteral, note2: NoteLiteral, note3: NoteLiteral): ITriad;
function getArchetype(
  ...args
    : []
    | [NoteLiteral]
    | [NoteLiteral, NoteLiteral]
    | [NoteLiteral, NoteLiteral, NoteLiteral]
) {
  const e = args;
  switch (e.length) {
    case 0: return getNull_ad();
    case 1: return getMonad(e[0]);
    case 2: return getDyad(e[0], e[1]);
    case 3: return getTriad(e[0], e[1], e[2]);
    default: throw new Error(`Invalid argument length: ${args.length}`)
  }
}

const directionalRetrospectiveSymbol = (
  symbol: RetrospectiveTriadSymbol,
  realization: Interval
): RetrospectiveDirectionalTriadSymbol => {
  switch (symbol) {
    case "(P)":
      if (realization.semitones > 0) { return "(uP)"; }
      else if (realization.semitones < 0) { return "(dP)"; }
    case "(IP)":
      if (realization.semitones > 0) { return "(uIP)"; }
      else if (realization.semitones < 0) { return "(dIP)"; }
      else if (realization.semitones === 0) { return "(lIP)"; }
    case "(VP)":
      if (realization.semitones > 0) { return "(uVP)"; }
      else if (realization.semitones < 0) { return "(dVP)"; }
    case "(R)":
      if (realization.semitones > 0) { return "(uR)"; }
      else if (realization.semitones < 0) { return "(dR)"; }
      else if (realization.semitones === 0) { return "(lR)"; }
    case "(IR)":
      if (realization.semitones > 0) { return "(uIR)"; }
      else if (realization.semitones < 0) { return "(dIR)"; }
    case "(VR)":
      if (realization.semitones > 0) { return "(uVR)"; }
      else if (realization.semitones < 0) { return "(dVR)"; }
    case "(D)":
      if (realization.semitones === 0) { return "(lD)"; }
    case "(ID)":
      if (realization.semitones > 0) { return "(uID)"; }
      else if (realization.semitones < 0) { return "(dID)"; }
    default: throw new Error(
      `Illegal symbol & interval given.
      Given symbol: ${symbol}
      Given interval: ${realization.semitones}`
    );
  }
};

const directionalProspectiveSymbol = (
  symbol: ProspectiveTriadSymbol,
  realization: Interval
): ProspectiveDirectionalTriadSymbol => {
  switch (symbol) {
    case "P":
      if (realization.semitones > 0) { return "uP"; }
      else if (realization.semitones < 0) { return "dP"; }
    case "IP":
      if (realization.semitones > 0) { return "uIP"; }
      else if (realization.semitones < 0) { return "dIP"; }
      else if (realization.semitones === 0) { return "lIP"; }
    case "VP":
      if (realization.semitones > 0) { return "uVP"; }
      else if (realization.semitones < 0) { return "dVP"; }
    case "R":
      if (realization.semitones > 0) { return "uR"; }
      else if (realization.semitones < 0) { return "dR"; }
      else if (realization.semitones === 0) { return "lR"; }
    case "IR":
      if (realization.semitones > 0) { return "uIR"; }
      else if (realization.semitones < 0) { return "dIR"; }
    case "VR":
      if (realization.semitones > 0) { return "uVR"; }
      else if (realization.semitones < 0) { return "dVR"; }
    case "D":
      if (realization.semitones === 0) { return "lD"; }
    case "ID":
      if (realization.semitones > 0) { return "uID"; }
      else if (realization.semitones < 0) { return "dID"; }
    default: throw new Error(
      `Illegal symbol & interval given.
      Given symbol: ${symbol}
      Given interval: ${realization.semitones}`
    );
  }
};

const directionalSymbol = (
  symbol: ArchetypeSymbol,
  realization: Interval
): ArchetypeDirectionalSymbol => {
  if (symbol.match(/\(..?\)/)) {
    return directionalRetrospectiveSymbol(symbol as RetrospectiveTriadSymbol, realization);
  }
  else {
    return directionalProspectiveSymbol(symbol as ProspectiveTriadSymbol, realization);
  }
};


const retrospectiveSymbol = (symbol: ProspectiveTriadSymbol): RetrospectiveTriadSymbol => {
  switch (symbol) {
    case "P": return "(P)";
    case "IP": return "(IP)";
    case "VP": return "(VP)";
    case "R": return "(R)";
    case "IR": return "(IR)";
    case "VR": return "(VR)";
    case "D": return "(D)";
    case "ID": return "(ID)";
    default: throw new Error(`Illegal symbol given.\nExpected symbol: P, IP, VP, R, IR, VR, D, ID\n Given symbol:${symbol}`);
  }
};

const getReverse = (
  I: DirectionName,
  V: DirectionName,
): ProspectiveTriadSymbol => {
  if (I !== "mL") { return "VR"; }
  else if (V !== "mL") { return "IR"; }
  else { return "R"; }
}

const getDuplication = (
  V: DirectionName,
): ProspectiveTriadSymbol => {
  if (V !== "mN") { return "ID" }
  else { return "D" }
}

const getProcessLike = (
  I: DirectionName,
  V: DirectionName,
): ProspectiveTriadSymbol => {
  if (V === "mR") { return "P" }
  else if (I === "mN") { return getDuplication(V); }
  else { return "IP" }
}

const getTriadArchetypeSymbol = (
  Id: DirectionName,
  Im: MagnitudeName,
  V: DirectionName,
): ProspectiveTriadSymbol => {
  if (Im === "AA") { return getProcessLike(Id, V) }
  else if (V === "mL") { return getReverse(Id, V); }
  else if (Id === "mL") { return "IR"; }
  else { return "VP" }
}

interface ITriadArchetype {
  readonly symbol: ProspectiveTriadSymbol;
  readonly notes: [NoteLiteral, NoteLiteral, NoteLiteral];
  readonly intervals: [IntervalName, IntervalName];
  readonly registral: IMotion;
  readonly intervallic: IMotion;
  readonly registral_return_form: IRegistralReturnForm;
}

const getTriadArchetype = (prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral): ITriadArchetype => {
  const notes = [prev || "", curr || "", next || ""] as [NoteLiteral, NoteLiteral, NoteLiteral];
  const intervals = [intervalOf(prev, curr), intervalOf(curr, next),] as [IntervalName, IntervalName];
  const initial = getInterval(intervals[0]);
  const follow = getInterval(intervals[1]);
  const registral = getRegistralMotion(initial, follow);
  const intervallic = getIntervallicMotion(initial, follow);
  const registral_return_form = getRegistralReturnForm(notes);
  const symbol = getTriadArchetypeSymbol(
    intervallic.direction.name,
    intervallic.magnitude.name,
    registral.direction.name,
  )

  return {
    notes,
    intervals,
    registral,
    intervallic,
    registral_return_form,
    symbol,
  }
}

const isRetrospective = (archetype: ITriadArchetype) => {
  const initial = getInterval(archetype.intervals[0]);
  const init_mgn = Math.abs(initial.num) < 5 ? "aa" : "ab";
  switch (archetype.symbol) {
    case "R":
    case "IR":
    case "VR":
      return init_mgn === "aa"
    default:
      return init_mgn === "ab"
  }
}

export interface ITriad {
  readonly length: 3;
  readonly symbol: TriadSymbol;
  readonly notes: [NoteLiteral, NoteLiteral, NoteLiteral];
  readonly intervals: [IntervalName, IntervalName];
  readonly registral: IMotion;
  readonly intervallic: IMotion;
  readonly registral_return_form: IRegistralReturnForm;
  readonly archetype: ITriadArchetype;
  readonly retrospective: boolean;
}

export const getTriad = (prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral):ITriad => {
  const archetype = getTriadArchetype(prev, curr, next)
  const { intervals, registral, intervallic, registral_return_form } = archetype;
  const retrospective = isRetrospective(archetype);

  return {
    length: 3,
    notes: [prev || "", curr || "", next || ""],
    archetype,
    intervals,
    registral,
    intervallic,
    registral_return_form,
    retrospective,
    symbol: retrospective ? retrospectiveSymbol(archetype.symbol) : archetype.symbol,
  }
}

export interface IDyad {
  readonly length: 2,
  readonly symbol: "Dyad",
  readonly notes: [NoteLiteral, NoteLiteral],
  readonly intervals: [IntervalName],
}

export const getDyad = (prev: NoteLiteral, curr: NoteLiteral): IDyad => ({
  length: 2,
  symbol: "Dyad",
  notes: [prev, curr],
  intervals: [intervalOf(prev, curr)],
})

export interface IMonad {
  readonly length: 1;
  readonly symbol: "M";
  readonly notes: [NoteLiteral]
}

export const getMonad = (note: NoteLiteral): IMonad => ({
  length: 1,
  symbol: "M",
  notes: [note],
})

export interface INull_ad {
  readonly length : 0;
  readonly symbol : "";
  readonly notes : []
}

export const getNull_ad = ():INull_ad => ({
   length : 0,
   symbol : "",
   notes : [],
})

const get_grb_on_parametric_scale = (archetype: ITriad): [number, number, number] => {
  const s = archetype.intervallic?.direction.name === "mL" ? -1 : 0;
  const v = archetype.intervallic?.direction.name === "mR" ? -1 : 0;
  const scale = archetype.intervallic?.magnitude.name === "AA" ? 0.25 : 0.5;
  const B = 120;
  switch (archetype.registral?.direction.name) {
    case "mL": return hsv2rgb(-120 + B, 1 + s * scale, 1 + v * scale);
    case "mN": return hsv2rgb(0 + B, 1 + s * scale, 1 + v * scale);
    case "mR": return hsv2rgb(120 + B, 1 + s * scale, 1 + v * scale);
  }
  return [64, 64, 64]
};

export function get_color_on_parametric_scale(archetype: ITriad | IDyad | IMonad | INull_ad) {
  if (
    archetype.symbol === "Dyad"
    || archetype.symbol === "M"
    || archetype.symbol === ""
  ) { return "rgb(64,64,64)" }
  return rgbToString(get_grb_on_parametric_scale(archetype))
}

export const get_color_on_digital_intervallic_scale = (archetype: ITriad) => {
  switch (archetype.symbol) {
    case "VP": case "(VP)": return "rgb(0, 0, 255)";
    case "P": case "(P)": return "rgb(0, 255, 0)";
    case "D": case "(D)": return "rgb(0, 255, 0)";
    case "IR": case "(IR)": return "rgb(255, 0, 0)";

    case "VR": case "(VR)": return "rgb(0, 0, 255)";
    case "IP": case "(IP)": return "rgb(0, 255, 0)";
    case "ID": case "(ID)": return "rgb(0, 255, 0)";
    case "R": case "(R)": return "rgb(255, 0, 0)";

    default: return "rgb(64, 64, 64)";
  }
};

export const get_color_on_digital_parametric_scale = (archetype: ITriad) => {
  switch (archetype.symbol) {
    case "VP": case "(VP)": return "rgb(0, 160, 255)";
    case "P": case "(P)": return "rgb(0, 0, 255)";
    case "D": case "(D)": return "rgb(0, 0, 255)";
    case "IR": case "(IR)": return "rgb(160, 0, 255)";

    case "VR": case "(VR)": return "rgb(0, 224, 0)";
    case "IP": case "(IP)": return "rgb(255, 160, 0)";
    case "ID": case "(ID)": return "rgb(255, 160, 0)";
    case "R": case "(R)": return "rgb(255, 0, 0)";

    default: return "rgb(64, 64, 64)";
  }
};

export const get_color_of_implication_realization = (archetype: ITriad) => {
  switch (archetype.symbol) {
    case "D": return "rgb(0,240,0)";
    case "ID": return "rgb(0, 0, 255)";

    case "VP": return "rgb(255, 0, 0)";
    case "P": return "rgb(0,240,0)";
    case "IP": return "rgb(0, 0, 255)";

    case "VR": return "rgb(255, 0, 0)";
    case "R": return "rgb(0,240,0)";
    case "IR": return "rgb(0, 0, 255)";


    case "(D)": return "rgb(0, 0, 0)";
    case "(ID)": return "rgb(255, 0, 0)";

    case "(VP)": return "rgb(0, 0, 0)";
    case "(P)": return "rgb(0, 0, 0)";
    case "(IP)": return "rgb(255, 0, 0)";

    case "(VR)": return "rgb(0, 0, 0)";
    case "(R)": return "rgb(0, 0, 0)";
    case "(IR)": return "rgb(255, 0, 0)";


    default: return "rgb(64, 64, 64)";
  }
};


const get_rgb_on_intervallic_angle = (
  n0: NoteLiteral,
  n1: NoteLiteral,
  n2: NoteLiteral,
) => {
  const intervals = [
    intervalOf(n0, n1),
    intervalOf(n1, n2)
  ].map(e => getInterval(e).semitones);
  const dist = (p => Math.tanh(p[0] * p[0] + p[1] * p[1]))(intervals) || 0;
  const angle = Math.atan2(intervals[1], intervals[0]) || 0;
  return hsv2rgb(angle * 360 / Math.PI, 1, dist);
};

const _get_color_on_intervallic_angle
  = (n0?: NoteLiteral, n1?: NoteLiteral, n2?: NoteLiteral) => rgbToString(
    get_rgb_on_intervallic_angle(n0 || "", n1 || "", n2 || "")
  );

export const get_color_on_intervallic_angle
  = (archetype: ITriad) =>
    _get_color_on_intervallic_angle(archetype.notes[0], archetype.notes[1], archetype.notes[2]);

export const get_color_of_Narmour_concept = (archetype: ITriad) => {
  switch (archetype.symbol) {
    case "VP": case "(VP)": return "rgb(0, 160, 255)";
    case "P": case "(P)": return "rgb(0, 0, 255)";
    case "IP": case "(IP)": return "rgb(160, 0, 255)";

    case "VR": case "(VR)": return "rgb(255, 0, 160)";
    case "R": case "(R)": return "rgb(255, 0, 0)";
    case "IR": case "(IR)": return "rgb(255, 160, 0)";

    case "D": case "(D)": return "rgb(0, 242, 0)";
    case "ID": case "(ID)": return "rgb(0, 255, 160)";

    default: return "rgb(64, 64, 64)";
  }
};

export const get_color_on_registral_scale = (archetype: ITriad) => {
  switch (archetype.symbol) {
    case "VP": case "(VP)": return "rgb(0, 0, 255)";
    case "P": case "(P)": return "rgb(0, 0, 255)";
    case "D": case "(D)": return "rgb(0, 0, 255)";
    case "IR": case "(IR)": return "rgb(0, 0, 255)";

    case "VR": case "(VR)": return "rgb(255, 0, 0)";
    case "IP": case "(IP)": return "rgb(255, 0, 0)";
    case "ID": case "(ID)": return "rgb(255, 0, 0)";
    case "R": case "(R)": return "rgb(255, 0, 0)";

    default: return "rgb(64, 64, 64)";
  }
};

