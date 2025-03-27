import { Chord } from "../../common/chord";
import { IHead as _IHead } from "../../common/i-head";

export interface IHead
  extends _IHead<Chord> {
  readonly recipe: "weak" | "progression" | "strong"
}
