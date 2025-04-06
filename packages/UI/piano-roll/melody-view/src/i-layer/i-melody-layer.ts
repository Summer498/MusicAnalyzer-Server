import { WindowReflectable } from "@music-analyzer/view";
import { IMelody } from "../i-part/i-melody";

export interface IMelodyLayer
  extends
  IMelody,
  WindowReflectable { }
