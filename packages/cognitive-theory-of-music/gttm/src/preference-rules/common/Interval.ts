export interface IntervalOfTime<Time> {
  isGreaterThan(operand: IntervalOfTime<Time>): boolean;
}

export const createIntervalOfTime = <Time>(time: { from: Time; to: Time }): IntervalOfTime<Time> => {
  return {
    isGreaterThan(_operand: IntervalOfTime<Time>) {
      return false; // TODO:
    },
  };
};
