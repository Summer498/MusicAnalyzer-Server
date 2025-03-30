import { WindowReflectable } from "@music-analyzer/view";
import { IMelody } from "./melody";

export interface IMelodyLayer
  extends
  IMelody,
  WindowReflectable { }
