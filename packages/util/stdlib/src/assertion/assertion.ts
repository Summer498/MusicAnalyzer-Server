export interface Assertion {
  onFailed(errorExecution: () => void): void;
}

export const createAssertion = (assertion: boolean): Assertion => ({
  onFailed: (errorExecution: () => void) => {
    if (!assertion) errorExecution();
  },
});
