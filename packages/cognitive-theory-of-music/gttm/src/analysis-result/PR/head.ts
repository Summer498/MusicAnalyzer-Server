import { Chord, Head as _Head } from "../common";

export interface Head 
  extends _Head<Chord> {
  readonly recipe: "weak" | "progression" | "strong"
}
