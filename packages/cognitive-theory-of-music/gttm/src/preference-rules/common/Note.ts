export interface Note<T> {
  readonly begin: T;
  readonly end: T;
  readonly length: T;
  readonly attack_point: T;
}

export const createNote = <T>(begin: T, end: T): Note<T> => ({
  begin,
  end,
  length: end,
  attack_point: begin,
});

