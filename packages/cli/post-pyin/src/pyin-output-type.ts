export type Vocals = {
  readonly sampling_rate: number,
  f0: (number | null)[],
  readonly voiced_flags: boolean[],
  readonly voiced_prob: number[]
};
