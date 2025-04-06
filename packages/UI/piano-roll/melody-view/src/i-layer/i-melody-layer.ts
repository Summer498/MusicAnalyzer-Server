import { WindowReflectable } from "@music-analyzer/view";
import { IMelody } from "../i-part";

export interface IMelodyLayer
  extends
  IMelody,
  WindowReflectable { }
