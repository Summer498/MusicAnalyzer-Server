import { Negatable } from "./create-negated";
import { Note } from "./Note";

export class IntervallicDistance<T> {
  constructor(notes: { from: Note<T>, to: Note<T> }) {
  }
  isGreaterThan(operand: IntervallicDistance<T>): boolean {
    return false;  // TODO:
  }
}

export class Transition<T> extends Negatable {
  readonly intervallic_distance: IntervallicDistance<T>;
  constructor(notes: { from: Note<T>, to: Note<T> }) {
    super();
    this.intervallic_distance = new IntervallicDistance(notes);
  }
  involves_aChangeInDynamics() {
    return false;  // TODO:
  }
  involves_aChangeInArticulation() {
    return false;  // TODO:
  }
}
