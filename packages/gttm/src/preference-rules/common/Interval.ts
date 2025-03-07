export class IntervalOfTime<Time> {
  constructor(time: { from: Time, to: Time }) {

  }
  isGreaterThan(operand: IntervalOfTime<Time>): boolean {
    return false;  // TODO:
  }
}