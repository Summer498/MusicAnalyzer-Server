import { MelodyBeepMediator } from "@music-analyzer/music-analyzer-application";
import { Checkbox } from "../switcher";

export class MelodyBeepSwitcher extends Checkbox {
  constructor(id: string, label: string) {
    super(id, label);
  }
  readonly subscribers: MelodyBeepMediator[] = [];
  register(...subscribers: MelodyBeepMediator[]) {
    this.subscribers.push(...subscribers);
  }
};

