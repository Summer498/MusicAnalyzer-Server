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
  default_x: number
  default_y: number
  duration: number
  voice: number
  type: string
  accidental?: string
  dot?: Record<string, never>
  stem?: string
  beam?: Beam
  pitch: Pitch
}
type SystemMargins = {
  left_margin: number,
  right_margin: number
}
type SystemLayout = {
  top_system_distance: number
  system_margins: SystemMargins
}
type Key = {
  fifths: number
}
type Time = {
  beats: number,
  beat_type: number
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
  system_layout: SystemLayout
}
type Barline = {
  location: string,
  bar_style: string
}
type Measure = {
  number: number
  width: number
  print?: Print
  attributes?: Attribute
  note: SingleOrArray<Note>
  barline?: Barline
}
interface Part extends HasID {
  measure: Measure[]
}
type Support = {
  attribute?: string
  element: string
  type: string
}
type Encoding = {
  software: string
  encoding_date: string
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
  work_title: string
}
type Scaling = {
  millimeters: number,
  tenths: number
}
type PageMargins = {
  type: string,
  left_margin: number,
  right_margin: number,
  top_margin: number,
  bottom_margin: number,
}
type PageLayout = {
  page_height: number,
  page_width: number,
  page_margins: PageMargins[]
}
type Font = {
  font_family: string,
  font_size: number
}
type Defaults = {
  scaling: Scaling
  page_layout: PageLayout
  word_font: Font
  lyric_font: Font
}
type CreditWords = {
  default_x: number
  default_y: number
  justify: string
  valign: string
  font_size: number
  text: string
}
type Credit = {
  page: number
  credit_type: string
  credit_words: CreditWords
}
interface ScoreInstrument extends HasID {
  instrument_name: string
}
interface MidiDevice extends HasID {
  port: number
}
interface MidiInstrument extends HasID {
  midi_channel: number,
  midi_program: number,
  volume: number,
  pan: number
}
interface ScorePart extends HasID {
  part_name: string
  part_abbreviation: string
  score_instrument: ScoreInstrument
  midi_device: MidiDevice
  midi_instrument: MidiInstrument
}
type PartList = {
  score_part: ScorePart
}
type ScorePartwise = {
  version: number
  work: Work
  part: Part
  identification: Identification
  defaults: Defaults
  credit: Credit
  part_list: PartList
}

export type MusicXML = {
  score_partwise: (Record<string, never> | ScorePartwise)[]
}
