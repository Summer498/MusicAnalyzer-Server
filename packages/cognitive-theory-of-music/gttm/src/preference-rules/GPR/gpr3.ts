import type { IntervallicDistance, Note } from "../common";
import { createPair, createTransition, createIntervallicDistance } from "../common";

export interface GPR3a<T> { readonly is_fulfilled: boolean }
export const createGPR3a = <T>(
  n1: Note<T>,
  n2: Note<T>,
  n3: Note<T>,
  n4: Note<T>,
) : GPR3a<T> => {
    // GPR3 (Change)
    // Consider a sequence of four notes, n1–n4. 
    // The transition n2–n3 may be heard as a group boundary if marked by
    // GPR3a (Register)
    // the transition n2-n3 involves a greater intervallic distance than both n1-n2 and n3-n4, or if
  const the = createTransition({ from: n2, to: n3 });
  const is_fulfilled
    = the.intervallic_distance.isGreaterThan(createIntervallicDistance({ from: n1, to: n2 }))
    && the.intervallic_distance.isGreaterThan(createIntervallicDistance({ from: n3, to: n4 }));
  return { is_fulfilled };
};

export interface GPR3b<T> { readonly is_fulfilled: boolean }
export const createGPR3b = <T>(
  n1: Note<T>,
  n2: Note<T>,
  n3: Note<T>,
  n4: Note<T>,
) : GPR3b<T> => {
    // GPR3 (Change)
    // Consider a sequence of four notes, n1–n4. 
    // The transition n2–n3 may be heard as a group boundary if marked by
    // GPR3b (Dynamics)
    // the transition n2-n3 involves a change in dynamics and n1-n2 and n3-n4 do not, or if
  const is_fulfilled
    = createTransition({ from: n2, to: n3 }).involves_aChangeInDynamics()
    && createTransition({ from: n1, to: n2 }).not.involves_aChangeInDynamics()
    && createTransition({ from: n3, to: n4 }).not.involves_aChangeInDynamics();
  return { is_fulfilled };
};


export interface GPR3c<T> { readonly is_fulfilled: boolean }
export const createGPR3c = <T>(
  n1: Note<T>,
  n2: Note<T>,
  n3: Note<T>,
  n4: Note<T>,
) : GPR3c<T> => {
    // GPR3 (Change)
    // Consider a sequence of four notes, n1–n4. 
    // The transition n2–n3 may be heard as a group boundary if marked by
    // GPR3c (Articulation)
    // the transition n2-n3 involves a change in articulation and n1-n2 and n3-n4 do not, or if
  const is_fulfilled
    = createTransition({ from: n2, to: n3 }).involves_aChangeInArticulation()
    && createTransition({ from: n1, to: n2 }).not.involves_aChangeInArticulation()
    && createTransition({ from: n3, to: n4 }).not.involves_aChangeInArticulation();
  return { is_fulfilled };
};

export interface GPR3d<T> { readonly is_fulfilled: boolean }
export const createGPR3d = <T>(
  n1: Note<T>,
  n2: Note<T>,
  n3: Note<T>,
  n4: Note<T>,
) : GPR3d<T> => {
    // GPR3 (Change)
    // Consider a sequence of four notes, n1–n4. 
    // The transition n2–n3 may be heard as a group boundary if marked by
    // GPR3d (Length)
    // n2 and n3 are of different length and both pairs n1,n2 and n3,n4 do not differ in length.
  const is_fulfilled
    = createPair(n2.length, n3.length).are.different()
    && createPair(n1.length, n2.length).are.not.different()
    && createPair(n3.length, n4.length).are.not.different();
  return { is_fulfilled };
};

