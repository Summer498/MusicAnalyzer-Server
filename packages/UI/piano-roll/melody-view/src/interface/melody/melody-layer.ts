import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { IMelody } from "./melody";

export interface IMelodyLayer
  extends
  IMelody,
  WindowReflectable { }
