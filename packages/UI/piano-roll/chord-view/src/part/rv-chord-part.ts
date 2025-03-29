import { ChordPartView } from "./view"

export interface RequiredViewByChordPart
  extends ChordPartView {
  updateX: (x: number) => void
  updateY: (y: number) => void
}
