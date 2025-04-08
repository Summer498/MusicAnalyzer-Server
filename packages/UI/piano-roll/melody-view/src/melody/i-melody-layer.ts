import { WindowReflectable } from "@music-analyzer/view";
import { IMelody } from "./i-melody";

export interface IMelodyLayer
  extends
  IMelody,
  WindowReflectable { }
