import { WindowReflectable } from "./facade";
import { IMelody } from "./melody";

export interface IMelodyLayer
  extends
  IMelody,
  WindowReflectable { }
