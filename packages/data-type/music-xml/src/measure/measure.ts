import { Note } from "./note"

export interface Measure {
  readonly number: number
  readonly width: number
  readonly note: Note | Note[]
}