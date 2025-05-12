type CreditWords = {
  readonly "default-x": number
  readonly "default-y": number
  readonly justify: string
  readonly valign: string
  readonly "font-size": number
  readonly text: string
}
type Credit = {
  readonly page: number
  readonly "credit-type": string
  readonly "credit-words": CreditWords
}
type Font = {
  readonly "font-family": string,
  readonly "font-size": number
}
type PageMargins = {
  readonly type: string,
  readonly "left-margin": number,
  readonly "right-margin": number,
  readonly "top-margin": number,
  readonly "bottom-margin": number,
}
type PageLayout = {
  readonly "page-height": number,
  readonly "page-width": number,
  readonly "page-margins": PageMargins[]
}
type Scaling = {
  readonly millimeters: number,
  readonly tenths: number
}
type Defaults = {
  readonly scaling: Scaling
  readonly "page-layout": PageLayout
  readonly "word-font": Font
  readonly "lyric-font": Font
}
type Creator = {
  readonly type: string
  readonly text: string
}
type Support = {
  readonly attribute?: string
  readonly element: string
  readonly type: string
}
type Encoding = {
  readonly software: string
  readonly "encoding-date": string
  readonly supports: Support[]
}
type Identification = {
  readonly creator: Creator
  readonly encoding: Encoding
}
interface MidiDevice
  extends HasID {
  readonly port: number
}
interface MidiInstrument
  extends HasID {
  readonly "midi-channel": number,
  readonly "midi-program": number,
  readonly volume: number,
  readonly pan: number
}
interface ScoreInstrument
  extends HasID {
  readonly "instrument-name": string
}
interface ScorePart
  extends HasID {
  readonly "part-name": string
  readonly "part-abbreviation": string
  readonly "score-instrument": ScoreInstrument
  readonly "midi-device": MidiDevice
  readonly "midi-instrument": MidiInstrument
}
type PartList = {
  readonly "score-part": ScorePart
}
type Work = {
  readonly "work-title": string
}
type ScorePartwise = {
  readonly version: number
  readonly work: Work
  readonly part: Part
  readonly identification: Identification
  readonly defaults: Defaults
  readonly credit: Credit
  readonly "part-list": PartList
}
type Clef = {
  readonly sign: string,
  readonly line: number
}
type Key = {
  readonly fifths: number
}
type Time = {
  readonly beats: number,
  readonly "beat-type": number
}
type Attribute = {
  readonly divisions: number
  readonly key: Key
  readonly time: Time
  readonly clef: Clef
}
type SystemMargins = {
  readonly "left-margin": number,
  readonly "right-margin": number
}
type SystemLayout = {
  readonly "top-system-distance": number
  readonly "system-margins": SystemMargins
}
type Print = {
  readonly "system-layout": SystemLayout
}
type Barline = {
  readonly location: string,
  readonly "bar-style": string
}
interface ExtendedMeasure 
  extends Measure {
  readonly print: Print
  readonly attributes: Attribute
  readonly barline: Barline
}
type Beam = {
  readonly number: number,
  readonly text: string
}
type Note = {
  readonly "default-x": number
  readonly "default-y": number
  readonly duration: number
  readonly voice: number
  readonly type: string
  readonly accidental?: string
  readonly dot?: string
  readonly stem?: string
  readonly beam?: Beam
  readonly pitch?: Pitch
  readonly rest?: "";
}
interface Measure {
  readonly number: number
  readonly width: number
  readonly note: Note | Note[]
}
interface Part 
  extends HasID {
  readonly measure: (Measure | ExtendedMeasure)[]
}
type HasID = {
  readonly id: BeatPos | `P${number}-I${number}`
}

export type BeatPos = `P${number}` | `P${number}-${number}-${number}`
export type Pitch = {
  readonly alter?: number,
  readonly step: string,
  readonly octave: number
}
export type MusicXML = {
  readonly "score-partwise": ScorePartwise
}
