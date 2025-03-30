import { ChordPartView } from "./facade"

export interface RequiredViewByChordPart
  extends ChordPartView {
  updateX: (x: number) => void
  updateY: (y: number) => void
}
