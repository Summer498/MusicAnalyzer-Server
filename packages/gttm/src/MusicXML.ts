import { BeatPos, SingleOrArray } from "./common";

type HasID = {
  id: BeatPos
}
type Pitch = {
  alter?: number,
  step: string,
  octave: number
}
type Beam = {
  number: number,
  text: string
}
type Note = {
  "default-x": number
  "default-y": number
  duration: number
  voice: number
  type: string
  accidental?: string
  dot?: string
  stem?: string
  beam?: Beam
  pitch: Pitch
}
type SystemMargins = {
  "left-margin": number,
  "right-margin": number
}
type SystemLayout = {
  "top-system-distance": number
  "system-margins": SystemMargins
}
type Key = {
  fifths: number
}
type Time = {
  beats: number,
  "beat-type": number
}
type Clef = {
  sign: string,
  line: number
}
type Attribute = {
  divisions: number
  key: Key
  time: Time
  clef: Clef
}
type Print = {
  "system-layout": SystemLayout
}
type Barline = {
  location: string,
  "bar-style": string
}
interface Measure {
  number: number
  width: number
  note: SingleOrArray<Note>
}

interface ExtendedMeasure extends Measure {
  print: Print
  attributes: Attribute
  barline: Barline
}

export interface Part extends HasID {
  measure: (Measure | ExtendedMeasure)[]
}
type Support = {
  attribute?: string
  element: string
  type: string
}
type Encoding = {
  software: string
  "encoding-date": string
  supports: Support[]
}
type Creator = {
  type: string
  text: string
}
type Identification = {
  creator: Creator
  encoding: Encoding
}
type Work = {
  "work-title": string
}
type Scaling = {
  millimeters: number,
  tenths: number
}
type PageMargins = {
  type: string,
  "left-margin": number,
  "right-margin": number,
  "top-margin": number,
  "bottom-margin": number,
}
type PageLayout = {
  "page-height": number,
  "page-width": number,
  "page-margins": PageMargins[]
}
type Font = {
  "font-family": string,
  "font-size": number
}
type Defaults = {
  scaling: Scaling
  "page-layout": PageLayout
  "word-font": Font
  "lyric-font": Font
}
type CreditWords = {
  "default-x": number
  "default-y": number
  justify: string
  valign: string
  "font-size": number
  text: string
}
type Credit = {
  page: number
  "credit-type": string
  "credit-words": CreditWords
}
interface ScoreInstrument extends HasID {
  "instrument-name": string
}
interface MidiDevice extends HasID {
  port: number
}
interface MidiInstrument extends HasID {
  "midi-channel": number,
  "midi-program": number,
  volume: number,
  pan: number
}
interface ScorePart extends HasID {
  "part-name": string
  "part-abbreviation": string
  "score-instrument": ScoreInstrument
  "midi-device": MidiDevice
  "midi-instrument": MidiInstrument
}
type PartList = {
  "score-part": ScorePart
}
export type ScorePartwise = {
  version: number
  work: Work
  part: Part
  identification: Identification
  defaults: Defaults
  credit: Credit
  "part-list": PartList
}

export type MusicXML = {
  "score-partwise": ScorePartwise
}
