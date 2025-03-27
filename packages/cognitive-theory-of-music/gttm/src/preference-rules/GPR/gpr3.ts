import { IntervallicDistance } from "../common/Transition";
import { Note } from "../common/Note";
import { Pair } from "../common/Pair";
import { Transition } from "../common/Transition";

export class GPR3a<T> {
  readonly is_fulfilled: boolean;
  constructor(
    n1: Note<T>,
    n2: Note<T>,
    n3: Note<T>,
    n4: Note<T>,
  ) {
    // GPR3 (Change)
    // Consider a sequence of four notes, n1–n4. 
    // The transition n2–n3 may be heard as a group boundary if marked by
    // GPR3a (Register)
    // the transition n2-n3 involves a greater intervallic distance than both n1-n2 and n3-n4, or if
    const the = new Transition({ from: n2, to: n3 });
    this.is_fulfilled
      = the.intervallic_distance.isGreaterThan(new IntervallicDistance({ from: n1, to: n2 }))
      && the.intervallic_distance.isGreaterThan(new IntervallicDistance({ from: n3, to: n4 }));
  }
}

export class GPR3b<T> {
  readonly is_fulfilled: boolean;
  constructor(
    n1: Note<T>,
    n2: Note<T>,
    n3: Note<T>,
    n4: Note<T>,
  ) {
    // GPR3 (Change)
    // Consider a sequence of four notes, n1–n4. 
    // The transition n2–n3 may be heard as a group boundary if marked by
    // GPR3b (Dynamics)
    // the transition n2-n3 involves a change in dynamics and n1-n2 and n3-n4 do not, or if
    this.is_fulfilled
      = new Transition({ from: n2, to: n3 }).involves_aChangeInDynamics()
      && new Transition({ from: n1, to: n2 }).not.involves_aChangeInDynamics()
      && new Transition({ from: n3, to: n4 }).not.involves_aChangeInDynamics();
  }
}


export class GPR3c<T> {
  readonly is_fulfilled: boolean;
  constructor(
    n1: Note<T>,
    n2: Note<T>,
    n3: Note<T>,
    n4: Note<T>,
  ) {
    // GPR3 (Change)
    // Consider a sequence of four notes, n1–n4. 
    // The transition n2–n3 may be heard as a group boundary if marked by
    // GPR3c (Articulation)
    // the transition n2-n3 involves a change in articulation and n1-n2 and n3-n4 do not, or if
    this.is_fulfilled
      = new Transition({ from: n2, to: n3 }).involves_aChangeInArticulation()
      && new Transition({ from: n1, to: n2 }).not.involves_aChangeInArticulation()
      && new Transition({ from: n3, to: n4 }).not.involves_aChangeInArticulation();
  }
}

export class GPR3d<T> {
  readonly is_fulfilled: boolean;
  constructor(
    n1: Note<T>,
    n2: Note<T>,
    n3: Note<T>,
    n4: Note<T>,
  ) {
    // GPR3 (Change)
    // Consider a sequence of four notes, n1–n4. 
    // The transition n2–n3 may be heard as a group boundary if marked by
    // GPR3d (Length)
    // n2 and n3 are of different length and both pairs n1,n2 and n3,n4 do not differ in length.
    this.is_fulfilled
      = new Pair(n2.length, n3.length).are.different()
      && new Pair(n1.length, n2.length).are.not.different()
      && new Pair(n3.length, n4.length).are.not.different();
  }
}
