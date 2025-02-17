type TimeAndString = {
  readonly 0: number;
  readonly 1: number;
  readonly 2: string
};
export class TimeAndChord {
  readonly begin: number;
  readonly end: number;
  readonly chord: string;
  constructor(time_and_string: TimeAndString){
    this.begin = time_and_string[0];
    this.end = time_and_string[1];
    this.chord = time_and_string[2];
  }
}