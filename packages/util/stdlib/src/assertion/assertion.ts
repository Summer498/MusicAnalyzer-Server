export class Assertion {
  #assertion: boolean;
  constructor(assertion: boolean) {
    this.#assertion = assertion;
  }
  onFailed(errorExecution: () => void) { this.#assertion || errorExecution(); }
}
