import { Negatable, withNegatable } from "./create-negated";
import { Note } from "./Note";

export interface IntervallicDistance<T> {
  isGreaterThan(operand: IntervallicDistance<T>): boolean;
}

export const createIntervallicDistance = <T>(notes: { from: Note<T>; to: Note<T> }): IntervallicDistance<T> => {
  return {
    isGreaterThan(_operand: IntervallicDistance<T>) {
      return false; // TODO:
    },
  };
};

export interface Transition<T> extends Negatable<Transition<T>> {
  readonly intervallic_distance: IntervallicDistance<T>;
  involves_aChangeInDynamics(): boolean;
  involves_aChangeInArticulation(): boolean;
}

export const createTransition = <T>(notes: { from: Note<T>; to: Note<T> }): Transition<T> => {
  const transition: Transition<T> = withNegatable({
    intervallic_distance: createIntervallicDistance(notes),
    involves_aChangeInDynamics() {
      return false; // TODO:
    },
    involves_aChangeInArticulation() {
      return false; // TODO:
    },
  });
  return transition;
};
