import { Chord } from "../../common";
import { IHead as _IHead } from "../../common";

export interface IHead
  extends _IHead<Chord> {
  readonly recipe: "weak" | "progression" | "strong"
}
